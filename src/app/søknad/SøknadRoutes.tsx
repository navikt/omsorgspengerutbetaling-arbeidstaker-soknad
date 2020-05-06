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
import { navigateTo, navigateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
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

    async function navigateToNextStepFrom(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.persist(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    setShowErrorMessage(true);
                }
            }
        }
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
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
        setButtonsAreDisabled(false)
    };

    const handleSøknadSentSuccessfully = async (sentSøknadApiData: SøknadApiData) => {
        setSøknadHasBeenSent(true);
        setSøknadApiData(sentSøknadApiData);
        resetForm();
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.purge(); // TODO: Hva skjer her ved 401 eller 5xx?
            } catch (error) {
                logApiCallErrorToSentryOrConsole(error);
            }
        }
        setIsLoading(false);
        navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
    };

    if (isLoading) {
        return <LoadingPage />;
    }
    if (showErrorMessage) {
        return <GeneralErrorPage />;
    }
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                exact={true}
                render={() => {
                    return (
                        <div>
                            <WelcomingPage
                                onValidSubmit={() => {
                                    setTimeout(() => {
                                        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                            // TODO: Handle call error
                                            SøknadTempStorage.persist(values, StepID.SITUASJON).then(() => {
                                                navigateTo(
                                                    `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.SITUASJON}`,
                                                    history
                                                );
                                            });
                                        } else {
                                            navigateTo(
                                                `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.SITUASJON}`,
                                                history
                                            );
                                        }
                                    });
                                }}
                            />
                            {lastStepID && (
                                <FortsettSøknadModalView
                                    isOpen={!!lastStepID && !hasBeenClosed}
                                    buttonsAreDisabled={buttonsAreDisabled}
                                    onRequestClose={() => {
                                        startPåNySøknad();
                                    }}
                                    onFortsettPåSøknad={() => fortsettPåPåbegyntSøknad(lastStepID)}
                                    onStartNySøknad={startPåNySøknad}
                                />
                            )}
                        </div>
                    );
                }}
            />

            {isAvailable(StepID.SITUASJON, values) && (
                <Route
                    path={getSøknadRoute(StepID.SITUASJON)}
                    exact={true}
                    render={() => (
                        <SituasjonStepView
                            onValidSubmit={() => navigateToNextStepFrom(StepID.SITUASJON)}
                            søkerdata={søkerdata}
                            formikProps={formikProps}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    exact={true}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStepFrom(StepID.PERIODE)} />}
                />
            )}

            {isAvailable(StepID.ANNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.ANNET)}
                    exact={true}
                    render={() => <AnnetStepView onValidSubmit={() => navigateToNextStepFrom(StepID.ANNET)} />}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    exact={true}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)} />}
                />
            )}

            {isAvailable(StepID.OPPSUMMERING, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPSUMMERING)}
                    exact={true}
                    render={() => (
                        <OppsummeringStep
                            søkerdata={søkerdata}
                            onApplicationSent={(sentSuccessfully, apiData?: SøknadApiData) => {
                                if (sentSuccessfully && apiData) {
                                    setIsLoading(true)
                                    handleSøknadSentSuccessfully(apiData)
                                } else {
                                    setShowErrorMessage(true);
                                    logToSentryOrConsole(
                                        `onApplicationSent: sentSuccessfully: ${sentSuccessfully}`,
                                        Severity.Critical
                                    )
                                }
                            }}
                        />
                    )}
                />
            )}

            {/* TODO: Case refresh på søknad sendt route må håndteres med noe annet enn GeneralErrorPage. Kanskje det faktisk trengs en Redirect? */}
            {søknadHasBeenSent && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    exact={true}
                    render={() => <ConfirmationPage søkerdata={søkerdata} søknadApiData={søknadApiData} />}
                />
            )}

            <Route
                path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                exact={true}
                component={() => {
                    navigateTo(RouteConfig.WELCOMING_PAGE_ROUTE, history);
                    return <LoadingPage />;
                }}
            />

            <Route component={() => <GeneralErrorPage />} />
        </Switch>
    );
};

export default SøknadRoutes;
