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
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, navigateToLoginPage, navigateToWelcomePage } from '../utils/navigationUtils';
import { getMaybeSøknadRoute, getNextStepId, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import SituasjonStepView from './situasjon-step/SituasjonStepView';
import SøknadTempStorage from './SøknadTempStorage';
import * as apiUtils from '../utils/apiUtils';
import FortsettSøknadModalView from '../components/fortsett-søknad-modal/FortsettSøknadModalView';
import { redirectIfForbiddenOrUnauthorized } from '../api/api';
import { WillRedirect } from '../types/types';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import appSentryLogger from '../utils/appSentryLogger';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { SKJEMANAVN } from '../App';
import FraværStep from './fravær-step/FraværStep';
import StengtBhgSkoleDokumenterStep from './stengt-bhg-skole-dokumenter-step/StengtBhgSkoleDokumenterStep';
import SmittevernDokumenterStep from './smittevern-dokumenter-step/SmittvernDokumenterStep';
import { getAlleUtbetalingsperioder } from '../utils/arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';

interface SøknadRoutesProps {
    lastStepID: StepID | undefined;
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

const ifAvailable = (stepID: StepID, values: SøknadFormData, component: JSX.Element): JSX.Element => {
    if (isAvailable(stepID, values)) {
        return component;
    } else {
        navigateToWelcomePage();
        return <LoadingPage />;
    }
};

const SøknadRoutes: React.FC<SøknadRoutesProps> = (props: SøknadRoutesProps): JSX.Element => {
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
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
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
        }
        navigateTo(getSøknadRoute(stepID), history);
    }

    const doStartSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        await SøknadTempStorage.create();
        navigateToStep(StepID.SITUASJON);
    };

    const navigateToNextStepIfExistsFrom = (stepID: StepID) => {
        const nextStepID: StepID | undefined = getNextStepId(stepID, values);
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
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.purge();
            } catch (error) {
                appSentryLogger.logApiError(error);
            }
        }
        navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
        setIsLoading(false);
    };

    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visStegDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visStegDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);

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
                render={(): JSX.Element => {
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
                path={getMaybeSøknadRoute(StepID.SITUASJON)}
                exact={true}
                render={(): JSX.Element => {
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
                render={(): JSX.Element => {
                    return ifAvailable(
                        StepID.FRAVÆR,
                        values,
                        <FraværStep onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.FRAVÆR)} />
                    );
                }}
            />
            {visStegDokumenterStengtBhgSkole && (
                <Route
                    path={getMaybeSøknadRoute(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                    exact={true}
                    render={(): JSX.Element => {
                        return ifAvailable(
                            StepID.DOKUMENTER_STENGT_SKOLE_BHG,
                            values,
                            <StengtBhgSkoleDokumenterStep
                                onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.DOKUMENTER_STENGT_SKOLE_BHG)}
                            />
                        );
                    }}
                />
            )}

            {visStegDokumenterSmittevern && (
                <Route
                    path={getMaybeSøknadRoute(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                    exact={true}
                    render={(): JSX.Element => {
                        return ifAvailable(
                            StepID.DOKUMENTER_SMITTEVERNHENSYN,
                            values,
                            <SmittevernDokumenterStep
                                onValidSubmit={() => navigateToNextStepIfExistsFrom(StepID.DOKUMENTER_SMITTEVERNHENSYN)}
                            />
                        );
                    }}
                />
            )}

            <Route
                path={getMaybeSøknadRoute(StepID.MEDLEMSKAP)}
                exact={true}
                render={(): JSX.Element => {
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
                render={(): JSX.Element => {
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
                render={(): JSX.Element => {
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
                component={(): JSX.Element => {
                    navigateToWelcomePage();
                    return <LoadingPage />;
                }}
            />
        </Switch>
    );
};

export default SøknadRoutes;
