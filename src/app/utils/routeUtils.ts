import { StepID } from '../søknad/soknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from './arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from './periodeUtils';
import {
    medlemskapStepIsAvailable,
    fraværStepIsAvailable,
    situasjonStepIsAvailable,
    summaryStepAvailable,
    legeerklæringStepIsAvailable,
} from './stepUtils';

export const getAvailableSteps = (values: SøknadFormData): StepID[] => {
    const steps: StepID[] = [];
    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);

    if (situasjonStepIsAvailable(values)) {
        steps.push(StepID.SITUASJON);
    }

    if (fraværStepIsAvailable(values)) {
        steps.push(StepID.FRAVÆR);
    }

    // TODO sjekk available
    if (visDokumenterStengtBhgSkole) {
        steps.push(StepID.DOKUMENTER_STENGT_SKOLE_BHG);
    }

    if (visDokumenterSmittevern) {
        steps.push(StepID.DOKUMENTER_SMITTEVERNHENSYN);
    }

    if (legeerklæringStepIsAvailable(values)) {
        steps.push(StepID.DOKUMENTER_LEGEERKLÆRING);
    }

    if (medlemskapStepIsAvailable(values)) {
        steps.push(StepID.MEDLEMSKAP);
    }

    if (summaryStepAvailable(values)) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};
