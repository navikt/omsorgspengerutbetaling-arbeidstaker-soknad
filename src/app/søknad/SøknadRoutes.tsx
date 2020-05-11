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
import PeriodeStep from './periode-step/PeriodeStep';
import SituasjonStepView from './situasjon-step/SituasjonStepView';
import SøknadTempStorage from './SøknadTempStorage';
import * as apiUtils from '../utils/apiUtils';
import FortsettSøknadModalView from '../components/fortsett-søknad-modal/FortsettSøknadModalView';
import { redirectIfForbiddenOrUnauthorized } from '../api/api';
import { WillRedirect } from '../types/types';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import AnnetStepView from './annet-step/AnnetStep';
import { logApiCallErrorToSentryOrConsole, logToSentryOrConsole } from '../utils/sentryUtils';
import { Severity } from '@sentry/types';

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

const SøknadRoutes = (props: SøknadRoutesProps) => {
    const { lastStepID, formikProps, søkerdata } = props;
    const { values, resetForm } = useFormikContext<SøknadFormData>();
    const history = useHistory();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = useState(false);
    const [søknadApiData, setSøknadApiData] = useState<SøknadApiData | undefined>(undefined);
    const [hasBeenClosed, setHasBeenClosed] = useState<boolean>(false);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonsAreDisabled, setButtonsAreDisabled] = useState<boolean>(false);

    const navigateToNextStepIfExistsFrom = (stepID: StepID) => {
        const nextStepID: StepID | undefined = getNextStepId(stepID, values);
        if (nextStepID) {
            navigateToStep(nextStepID);
        }
    };

    async function navigateToStep(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.persist(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    setShowErrorMessage(true);
                    logApiCallErrorToSentryOrConsole(error);
                }
            }
        }
        navigateTo(getSøknadRoute(stepID), history);
    }

    const fortsettPåPåbegyntSøknad = async (lastStepId: StepID) => {
        setButtonsAreDisabled(true);
        await navigateTo(lastStepId, history);
        setButtonsAreDisabled(false);
    };

    const startPåNySøknad = async () => {
        setButtonsAreDisabled(true);
        try {
            await SøknadTempStorage.purge();
            setHasBeenClosed(true);
            formikProps.setFormikState((prevState) => {
                return {
                    ...prevState,
                    values: initialValues
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

    const handleSøknadSentSuccessfully = async (sentSøknadApiData: SøknadApiData) => {
        setSøknadHasBeenSent(true);
        setSøknadApiData(sentSøknadApiData);
        resetForm();
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.purge();
            } catch (error) {
                logApiCallErrorToSentryOrConsole(error);
            }
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
                            <WelcomingPage onValidSubmit={() => navigateToStep(StepID.SITUASJON)} />
                            {lastStepID && (
                                <FortsettSøknadModalView
                                    isOpen={!!lastStepID && !hasBeenClosed}
                                    buttonsAreDisabled={buttonsAreDisabled}
                                    onRequestClose={startPåNySøknad}
                                    onFortsettPåSøknad={() => fortsettPåPåbegyntSøknad(lastStepID)}
                                    onStartNySøknad={startPåNySøknad}
                                />
                            )}
                        </div>
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
                                    logToSentryOrConsole(
                                        `onApplicationSent: sentSuccessfully: ${sentSuccessfully}`,
                                        Severity.Critical
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
                exact={true}
                component={() => {
                    navigateTo(RouteConfig.WELCOMING_PAGE_ROUTE, history);
                    return <LoadingPage />;
                }}
            />

            <Route component={() => <LoadingPage />} />
        </Switch>
    );
};

export default SøknadRoutes;
