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
import BegrunnelseStep from './begrunnelse-step/BegrunnelseStepView';
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

    async function navigateToNextStepFrom(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.persist(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    setShowErrorMessage(true)
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
        navigateTo(lastStepId, history);
    };

    const startPåNySøknad = async () => {
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
            const willRedirect = redirectIfForbiddenOrUnauthorized(e);
            if (willRedirect === WillRedirect.No) {
                setShowErrorMessage(true);
            } else {
                setIsLoading(true)
            }
        }
    };

    if (isLoading) {
        return(<LoadingPage />);
    }
    if (showErrorMessage) {
        return (<GeneralErrorPage/>);
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
                                                    `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.BEGRUNNELSE}`,
                                                    history
                                                );
                                            });
                                        } else {
                                            navigateTo(
                                                `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.BEGRUNNELSE}`,
                                                history
                                            );
                                        }
                                    });
                                }}
                            />
                            {lastStepID && (
                                <FortsettSøknadModalView
                                    isOpen={!!lastStepID && !hasBeenClosed}
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

            {isAvailable(StepID.BEGRUNNELSE, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEGRUNNELSE)}
                    exact={true}
                    render={() => <BegrunnelseStep onValidSubmit={() => navigateToNextStepFrom(StepID.BEGRUNNELSE)} />}
                />
            )}

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
                            onApplicationSent={(apiData: SøknadApiData) => {
                                setSøknadHasBeenSent(true);
                                setSøknadApiData(apiData);
                                resetForm();
                                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                    SøknadTempStorage.purge(); // TODO: Hva skjer her ved 401 eller 5xx?
                                }
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {søknadHasBeenSent && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => <ConfirmationPage søkerdata={søkerdata} søknadApiData={søknadApiData} />}
                />
            )}

            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true} component={() => {
                navigateTo(RouteConfig.WELCOMING_PAGE_ROUTE, history);
                return <LoadingPage />
            }} />

            <Route component={() => (<GeneralErrorPage />)} />
        </Switch>
    );
};

export default SøknadRoutes;
