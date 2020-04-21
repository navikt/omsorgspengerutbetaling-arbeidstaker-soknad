import { HvorLengeJobbet, SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'BEGRUNNELSE' = 'begrunnelse',
    'DOKUMENTER' = 'vedlegg',
    'SITUASJON' = 'situasjon',
    'PERIODE' = 'periode',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering'
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
    nextButtonAriaLabel?: string;
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
        nextButtonAriaLabel: 'step.nextButtonAriaLabel'
    };
};

export const getStepConfig = (formData?: SøknadFormData): StepConfigInterface => {
    let idx = 0;

    const skalViseDokumenterStep: boolean = formData
        ? formData[SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver] === HvorLengeJobbet.MER_ENN_FIRE_UKER
        : false;

    const delEn = {
        [StepID.BEGRUNNELSE]: {
            ...getStepConfigItemTextKeys(StepID.BEGRUNNELSE),
            index: idx++,
            nextStep: skalViseDokumenterStep ? StepID.DOKUMENTER : StepID.SITUASJON,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        }
    };

    let optionalDelVedlegg = {};
    if (skalViseDokumenterStep) {
        optionalDelVedlegg = {
            [StepID.DOKUMENTER]: {
                ...getStepConfigItemTextKeys(StepID.DOKUMENTER),
                index: idx++,
                nextStep: StepID.SITUASJON,
                backLinkHref: getSøknadRoute(StepID.BEGRUNNELSE)
            }
        };
    }

    const delTo = {
        [StepID.SITUASJON]: {
            ...getStepConfigItemTextKeys(StepID.SITUASJON),
            index: idx++,
            nextStep: StepID.PERIODE,
            backLinkHref: skalViseDokumenterStep
                ? getSøknadRoute(StepID.DOKUMENTER)
                : getSøknadRoute(StepID.BEGRUNNELSE)
        },
        [StepID.PERIODE]: {
            ...getStepConfigItemTextKeys(StepID.PERIODE),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.SITUASJON)
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.OPPSUMMERING,
            backLinkHref: getSøknadRoute(StepID.PERIODE)
        },
        [StepID.OPPSUMMERING]: {
            ...getStepConfigItemTextKeys(StepID.OPPSUMMERING),
            index: idx++,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
            nextButtonLabel: 'step.sendButtonLabel',
            nextButtonAriaLabel: 'step.sendButtonAriaLabel'
        }
    };

    return {
        ...delEn,
        ...optionalDelVedlegg,
        ...delTo
    };
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
