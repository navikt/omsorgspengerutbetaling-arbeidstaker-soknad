import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import RouteConfig from '../config/routeConfig';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { Person } from '../types/Søkerdata';
import { SøknadFormData } from '../types/SøknadFormData';
import FraværStep from './fravær-step/FraværStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import SituasjonStepView from './situasjon-step/SituasjonStepView';
import SmittevernDokumenterStep from './smittevern-dokumenter-step/SmittvernDokumenterStep';
import StengtBhgSkoleDokumenterStep from './stengt-bhg-skole-dokumenter-step/StengtBhgSkoleDokumenterStep';
import { useIntl } from 'react-intl';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import { getAvailableSteps } from '../utils/routeUtils';
import { mapFormDataToApiData } from '../utils/mapFormDataToApiData';
import { SøknadApiData } from '../types/SøknadApiData';
import VelkommenPage from '../pages/velkommen-page/VelkommenPage';
import LegeerklæringDokumenterStep from './legeerklæring-dokumenter-step/LegeerklæringDokumenterStep';

interface Props {
    søker: Person;
    soknadId?: string;
    kvitteringInfo?: SøknadApiData;
}

const SoknadRoutes: React.FC<Props> = ({ søker, soknadId, kvitteringInfo }) => {
    const intl = useIntl();

    const { values } = useFormikContext<SøknadFormData>();
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();

    const availableSteps = getAvailableSteps(values);

    const renderSoknadStep = (søker: Person, stepID: StepID, soknadId: string): React.ReactNode => {
        switch (stepID) {
            case StepID.SITUASJON:
                return <SituasjonStepView />;
            case StepID.FRAVÆR:
                return <FraværStep />;
            case StepID.DOKUMENTER_STENGT_SKOLE_BHG:
                return <StengtBhgSkoleDokumenterStep />;
            case StepID.DOKUMENTER_SMITTEVERNHENSYN:
                return <SmittevernDokumenterStep />;
            case StepID.DOKUMENTER_LEGEERKLÆRING:
                return <LegeerklæringDokumenterStep søker={søker} soknadId={soknadId} />;
            case StepID.MEDLEMSKAP:
                return <MedlemsskapStep />;
            case StepID.OPPSUMMERING:
                const apiValues: SøknadApiData = mapFormDataToApiData(values, intl);
                return <OppsummeringStep søker={søker} apiValues={apiValues} />;
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];

    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status)) {
                            return <ConfirmationPage søker={søker} søknadApiData={kvitteringInfo} />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>

            {soknadId === undefined && <Redirect key="redirectToWelcome" to={RouteConfig.SØKNAD_ROUTE_PREFIX} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, step, soknadId)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => (
                        <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />
                    )}></ErrorPage>
            </Route>
        </Switch>
    );
};

export default SoknadRoutes;
