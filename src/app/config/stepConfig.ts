import { getMaybeSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'SITUASJON' = 'situasjon',
    'FRAVÆR' = 'fravær',
    'ANNET' = 'annet',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
}

export interface StepItemConfigInterface extends StepConfigItemTexts {
    index: number;
    nextStep?: StepID;
    backLinkHref?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: 'step.nextButtonLabel',
    };
};

export const getStepConfig = (): StepConfigInterface => {
    let idx = 0;

    return {
        [StepID.SITUASJON]: {
            ...getStepConfigItemTextKeys(StepID.SITUASJON),
            index: idx++,
            nextStep: StepID.FRAVÆR,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.FRAVÆR]: {
            ...getStepConfigItemTextKeys(StepID.FRAVÆR),
            index: idx++,
            nextStep: StepID.ANNET,
            backLinkHref: getMaybeSøknadRoute(StepID.SITUASJON),
        },
        [StepID.ANNET]: {
            ...getStepConfigItemTextKeys(StepID.ANNET),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getMaybeSøknadRoute(StepID.FRAVÆR),
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.OPPSUMMERING,
            backLinkHref: getMaybeSøknadRoute(StepID.ANNET),
        },
        [StepID.OPPSUMMERING]: {
            ...getStepConfigItemTextKeys(StepID.OPPSUMMERING),
            index: idx++,
            backLinkHref: getMaybeSøknadRoute(StepID.MEDLEMSKAP),
            nextButtonLabel: 'step.sendButtonLabel',
        },
    };
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
