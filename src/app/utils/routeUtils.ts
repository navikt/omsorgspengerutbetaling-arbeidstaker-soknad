import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    medlemskapStepIsAvailable,
    fraværStepIsAvailable,
    situasjonStepIsAvailable,
    summaryStepAvailable,
} from './stepUtils';

export const getMaybeSøknadRoute = (stepId: StepID | undefined): string | undefined => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getSøknadRoute = (stepId: StepID): string => `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;

export const getNextStepRoute = (stepId: StepID, values: SøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(values);
    return stepConfig[stepId] ? getMaybeSøknadRoute(stepConfig[stepId].nextStep) : undefined;
};

export const getNextStepId = (stepId: StepID, values: SøknadFormData): StepID | undefined => {
    const stepConfig = getStepConfig(values);
    return stepConfig[stepId] ? stepConfig[stepId].nextStep : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SøknadFormData): boolean => {
    switch (path) {
        case StepID.SITUASJON:
            return situasjonStepIsAvailable(values);
        case StepID.FRAVÆR:
            return fraværStepIsAvailable(values);
        case StepID.MEDLEMSKAP:
            return medlemskapStepIsAvailable(values);
        case StepID.OPPSUMMERING:
            return summaryStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE: {
            return values[SøknadFormField.harBekreftetOpplysninger];
        }
        default:
            return true;
    }
};
