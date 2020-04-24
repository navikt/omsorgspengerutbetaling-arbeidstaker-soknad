import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { FormikProps, useFormikContext } from 'formik';
import ConfirmationPage from '../components/pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../components/pages/welcoming-page/WelcomingPage';
import RouteConfig from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
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
import { SøkerdataContextConsumer } from '../context/SøkerdataContext';

export interface KvitteringInfo {
    søkernavn: string;
}

// const getKvitteringInfoFromApiData = (søkerdata: Søkerdata): KvitteringInfo | undefined => {
//     const { fornavn, mellomnavn, etternavn } = søkerdata.person;
//     return {
//         søkernavn: formatName(fornavn, etternavn, mellomnavn)
//     };
// };

interface SøknadRoutesProps {
    lastStepID?: StepID;
    formikProps: FormikProps<SøknadFormData>;
}

function SøknadRoutes(props: SøknadRoutesProps) {
    const { lastStepID, formikProps } = props;

    const { values, resetForm } = useFormikContext<SøknadFormData>();

    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [søkerdata, setSøkerdata] = React.useState<Søkerdata | undefined>(undefined);
    const [søknadApiData, setSøknadApiData] = React.useState<SøknadApiData | undefined>(undefined);

    // const søknadApiDataMock = mock1;
    // const søkerdataMock: Søkerdata = {
    //     person: {
    //         etternavn: "Duck",
    //         fornavn: "Skrue",
    //         mellomnavn: "Mc",
    //         kjønn: "mann",
    //         fødselsnummer: "17108102454",
    //         myndig: true
    //     },
    //     setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => null,
    //     arbeidsgivere: []
    // };

    const history = useHistory();

    if (history.location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE && lastStepID) {
        setTimeout(() => {
            navigateTo(lastStepID, history);
        });
    }

    async function navigateToNextStepFrom(stepID: StepID) {
        if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
            try {
                await SøknadTempStorage.persist(values, stepID);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
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

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <WelcomingPage
                        onValidSubmit={() =>
                            setTimeout(() => {
                                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                    SøknadTempStorage.persist(values, StepID.SITUASJON).then(() => {
                                        navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.BEGRUNNELSE}`, history);
                                    });
                                } else {
                                    navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.BEGRUNNELSE}`, history);
                                }
                            })
                        }
                    />
                )}
            />

            {isAvailable(StepID.BEGRUNNELSE, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEGRUNNELSE)}
                    render={() => <BegrunnelseStep onValidSubmit={() => navigateToNextStepFrom(StepID.BEGRUNNELSE)} />}
                />
            )}

            {isAvailable(StepID.SITUASJON, values) && (
                <Route
                    path={getSøknadRoute(StepID.SITUASJON)}
                    render={() => (
                        <SøkerdataContextConsumer>
                            {(søkerData) => {
                                if (søkerData) {
                                    return (
                                        <SituasjonStepView
                                            onValidSubmit={() => navigateToNextStepFrom(StepID.SITUASJON)}
                                            søkerdata={søkerData}
                                            formikProps={formikProps}
                                        />
                                    );
                                }
                                return <div>Manglende søkerdata</div>;
                            }}
                        </SøkerdataContextConsumer>
                    )}
                />
            )}

            {isAvailable(StepID.PERIODE, values) && (
                <Route
                    path={getSøknadRoute(StepID.PERIODE)}
                    render={() => <PeriodeStep onValidSubmit={() => navigateToNextStepFrom(StepID.PERIODE)} />}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)} />}
                />
            )}

            {isAvailable(StepID.OPPSUMMERING, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPSUMMERING)}
                    render={() => (
                        <OppsummeringStep
                            onApplicationSent={(apiData: SøknadApiData, sokerdata: Søkerdata) => {
                                setSøknadHasBeenSent(true);
                                setSøkerdata(sokerdata);
                                setSøknadApiData(apiData);
                                resetForm();
                                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                                    SøknadTempStorage.purge();
                                }
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => {
                        // we clear form state here to ensure that no steps will be available
                        // after the application has been sent. this is done in a setTimeout
                        // because we do not want to update state during render.
                        if (values.harForståttRettigheterOgPlikter === true) {
                            // Only call reset if it has not been called before (prevent loop)
                            setTimeout(() => {
                                resetForm();
                            });
                        }
                        if (søknadHasBeenSent === false) {
                            setSøknadHasBeenSent(true);
                        }

                        return <ConfirmationPage søkerdata={søkerdata} søknadApiData={søknadApiData} />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />

            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
}

export default SøknadRoutes;
