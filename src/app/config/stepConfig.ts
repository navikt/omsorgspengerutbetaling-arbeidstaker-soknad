import { SøknadFormData } from '../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from 'app/utils/arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from '../utils/periodeUtils';
import { getMaybeSøknadRoute } from '../utils/routeUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'SITUASJON' = 'situasjon',
    'FRAVÆR' = 'fravær',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
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

export const getStepConfig = (values: SøknadFormData): StepConfigInterface => {
    let idx = 0;
    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);

    const getMedlemskapPrevStep = (): StepID => {
        if (visDokumenterSmittevern) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        if (visDokumenterStengtBhgSkole) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        return StepID.FRAVÆR;
    };

    const getFravæNextStep = (): StepID => {
        if (visDokumenterStengtBhgSkole) {
            return StepID.DOKUMENTER_STENGT_SKOLE_BHG;
        }
        if (visDokumenterSmittevern) {
            return StepID.DOKUMENTER_SMITTEVERNHENSYN;
        }
        return StepID.MEDLEMSKAP;
    };

    const config: StepConfigInterface = {
        [StepID.SITUASJON]: {
            ...getStepConfigItemTextKeys(StepID.SITUASJON),
            index: idx++,
            nextStep: StepID.FRAVÆR,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.FRAVÆR]: {
            ...getStepConfigItemTextKeys(StepID.FRAVÆR),
            index: idx++,
            nextStep: getFravæNextStep(),
            backLinkHref: getMaybeSøknadRoute(StepID.SITUASJON),
        },
    };

    if (visDokumenterStengtBhgSkole) {
        config[StepID.DOKUMENTER_STENGT_SKOLE_BHG] = {
            ...getStepConfigItemTextKeys(StepID.DOKUMENTER_STENGT_SKOLE_BHG),
            index: idx++,
            nextStep: visDokumenterSmittevern ? StepID.DOKUMENTER_SMITTEVERNHENSYN : StepID.MEDLEMSKAP,
            backLinkHref: getMaybeSøknadRoute(StepID.FRAVÆR),
        };
    }
    if (visDokumenterSmittevern) {
        config[StepID.DOKUMENTER_SMITTEVERNHENSYN] = {
            ...getStepConfigItemTextKeys(StepID.DOKUMENTER_SMITTEVERNHENSYN),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getMaybeSøknadRoute(
                visDokumenterStengtBhgSkole ? StepID.DOKUMENTER_STENGT_SKOLE_BHG : StepID.FRAVÆR
            ),
        };
    }

    config[StepID.MEDLEMSKAP] = {
        ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
        index: idx++,
        nextStep: StepID.OPPSUMMERING,
        backLinkHref: getMaybeSøknadRoute(getMedlemskapPrevStep()),
    };
    config[StepID.OPPSUMMERING] = {
        ...getStepConfigItemTextKeys(StepID.OPPSUMMERING),
        index: idx++,
        backLinkHref: getMaybeSøknadRoute(StepID.MEDLEMSKAP),
        nextButtonLabel: 'step.sendButtonLabel',
    };
    return config;
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}
