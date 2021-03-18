import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { FormikProps, useFormikContext } from 'formik';
import ConfirmationPage from '../components/pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../components/pages/welcoming-page/WelcomingPage';
import RouteConfig from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadApiData } from '../types/SøknadApiData';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { navigateTo, navigateToLoginPage, navigateToWelcomePage } from '../utils/navigationUtils';
import { getMaybeSøknadRoute, getNextStepId, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import FraværStep from './fravær-step/FraværStep';
import SituasjonStepView from './situasjon-step/SituasjonStepView';
import SøknadTempStorage from './SøknadTempStorage';
import * as apiUtils from '../utils/apiUtils';
import FortsettSøknadModalView from '../components/fortsett-søknad-modal/FortsettSøknadModalView';
import { redirectIfForbiddenOrUnauthorized } from '../api/api';
import { WillRedirect } from '../types/types';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import AnnetStepView from './annet-step/AnnetStep';
import appSentryLogger from '../utils/appSentryLogger';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { SKJEMANAVN } from '../App';
import PeriodeStep from './periode-step/PeriodeStep';
import BarnStep from './barn-step/BarnStep';

interface SøknadRoutesProps {
    lastStepID: StepID | undefined;
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

const ifAvailable = (stepID: StepID, values: SøknadFormData, component: JSX.Element) => {
    if (isAvailable(stepID, values)) {
        return component;
    } else {
        navigateToWelcomePage();
        return <LoadingPage />;
    }
};

const SøknadRoutes: React.FC<SøknadRoutesProps> = (props: SøknadRoutesProps) => {
    const { lastStepID, formikProps, søkerdata } = props;
    const { values, resetForm } = useFormikContext<SøknadFormData>();
    const history = useHistory();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = useState(false);
    const [søknadApiData, setSøknadApiData] = useState<SøknadApiData | undefined>(undefined);
    const [hasBeenClosed, setHasBeenClosed] = useState<boolean>(false);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonsAreDisabled, setButtonsAreDisabled] = useState<boolean>(false);

    const { logUserLoggedOut, logSoknadStartet } = useAmplitudeInstance();

    async function navigateToStep(stepID: StepID) {
        try {
            await SøknadTempStorage.update(values, stepID);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                logUserLoggedOut('Ved mellomlagring');
                navigateToLoginPage();
            } else {
                setShowErrorMessage(true);
                appSentryLogger.logApiError(error);
            }
        }
        navigateTo(getSøknadRoute(stepID), history);
    }

    const doStartSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        await SøknadTempStorage.create();
        navigateToStep(StepID.PERIODE);
    };

    const navigateToNextStepIfExistsFrom = (stepID: StepID) => {
        const nextStepID: StepID | undefined = getNextStepId(stepID);
        if (nextStepID) {
            navigateToStep(nextStepID);
        }
    };

    const fortsettPåPåbegyntSøknad = async (): Promise<void> => {
        setButtonsAreDisabled(true);
        if (lastStepID) {
            await navigateTo(lastStepID, history);
        } else {
            // TODO: Handle. Something went wrong.
        }
        setButtonsAreDisabled(false);
    };

    const startPåNySøknad = async (): Promise<void> => {
        setButtonsAreDisabled(true);
        try {
            await SøknadTempStorage.purge();
            setHasBeenClosed(true);
            formikProps.setFormikState((prevState) => {
                return {
                    ...prevState,
                    values: initialValues,
                };
            });
        } catch (e) {
            const willRedirect = await redirectIfForbiddenOrUnauthorized(e);
            if (willRedirect === WillRedirect.No) {
                setShowErrorMessage(true);
            } else {
                setIsLoading(true);
            }
        }
        setButtonsAreDisabled(false);
    };

    const handleSøknadSentSuccessfully = async (sentSøknadApiData: SøknadApiData): Promise<void> => {
        setSøknadHasBeenSent(true);
        setSøknadApiData(sentSøknadApiData);
        resetForm();
        try {
            await SøknadTempStorage.purge();
        } catch (error) {
            appSentryLogger.logApiError(error);
        }
        navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
        setIsLoading(false);
    };

    if (isLoading) {
        return <LoadingPage />;
    }
    if (showErrorMessage) {
        return <GeneralErrorPage cause={'showErrorMessage in SøknadRoutes'} />;
    }
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                exact={true}
                render={() => {
                    return (
                        <div>
                            <WelcomingPage onValidSubmit={doStartSoknad} />
                            <FortsettSøknadModalView
                                isOpen={!!lastStepID && !hasBeenClosed}
                                buttonsAreDisabled={buttonsAreDisabled}
                                onRequestClose={startPåNySøknad}
                                onFortsettPåSøknad={fortsettPåPåbegyntSøknad}
                                onStartNySøknad={startPåNySøknad}
                            />
                        </div>
                    );
                }}
            />

            <Route
                path={getMaybeSøknadRoute(StepID.PERIODE)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.PERIODE,
                        values,
                        <PeriodeStep onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.PERIODE)} />
                    );
                }}
            />
            <Route
                path={getMaybeSøknadRoute(StepID.BARN)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.BARN,
                        values,
                        <BarnStep
                            registrerteBarn={[]}
                            onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.BARN)}
                        />
                    );
                }}
            />
            <Route
                path={getMaybeSøknadRoute(StepID.SITUASJON)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.SITUASJON,
                        values,
                        <SituasjonStepView
                            onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.SITUASJON)}
                            søkerdata={søkerdata}
                            formikProps={formikProps}
                        />
                    );
                }}
            />

            <Route
                path={getMaybeSøknadRoute(StepID.FRAVÆR)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.FRAVÆR,
                        values,
                        <FraværStep onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.FRAVÆR)} />
                    );
                }}
            />

            <Route
                path={getMaybeSøknadRoute(StepID.ANNET)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.ANNET,
                        values,
                        <AnnetStepView onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.ANNET)} />
                    );
                }}
            />

            <Route
                path={getMaybeSøknadRoute(StepID.MEDLEMSKAP)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.MEDLEMSKAP,
                        values,
                        <MedlemsskapStep onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.MEDLEMSKAP)} />
                    );
                }}
            />

            <Route
                path={getMaybeSøknadRoute(StepID.OPPSUMMERING)}
                exact={true}
                render={() => {
                    return ifAvailable(
                        StepID.OPPSUMMERING,
                        values,
                        <OppsummeringStep
                            søkerdata={søkerdata}
                            onApplicationSent={(sentSuccessfully, apiData?: SøknadApiData) => {
                                if (sentSuccessfully && apiData) {
                                    setIsLoading(true);
                                    handleSøknadSentSuccessfully(apiData);
                                } else {
                                    setShowErrorMessage(true);
                                    appSentryLogger.logError(
                                        `onApplicationSent: sentSuccessfully: ${sentSuccessfully}`
                                    );
                                }
                            }}
                        />
                    );
                }}
            />

            <Route
                path={RouteConfig.SØKNAD_SENDT_ROUTE}
                exact={true}
                render={() => {
                    if (søknadHasBeenSent) {
                        return <ConfirmationPage søkerdata={søkerdata} søknadApiData={søknadApiData} />;
                    } else {
                        navigateToWelcomePage();
                        return <LoadingPage />;
                    }
                }}
            />

            <Route
                path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                component={() => {
                    navigateToWelcomePage();
                    return <LoadingPage />;
                }}
            />
        </Switch>
    );
};

export default SøknadRoutes;
