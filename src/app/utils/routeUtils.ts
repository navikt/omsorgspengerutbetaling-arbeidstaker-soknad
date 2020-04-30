import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    begrunnelseStepIsAvailable,
    medlemskapStepIsAvailable,
    periodeStepIsAvailable,
    situasjonStepIsAvailable,
    summaryStepAvailable
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: SøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] ? getSøknadRoute(stepConfig[stepId].nextStep) : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SøknadFormData) => {
    switch (path) {
        case StepID.BEGRUNNELSE:
            return begrunnelseStepIsAvailable(values);
        case StepID.SITUASJON:
            return situasjonStepIsAvailable(values);
        case StepID.PERIODE:
            return periodeStepIsAvailable(values);
        case StepID.MEDLEMSKAP:
            return medlemskapStepIsAvailable(values);
        case StepID.OPPSUMMERING:
            return summaryStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE: {
            return values[SøknadFormField.harBekreftetOpplysninger];
        }
    }
    return true;
};
