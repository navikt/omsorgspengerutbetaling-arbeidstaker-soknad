import { StepID } from '../søknad/soknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from './arbeidsforholdUtils';
import { skalEndringeneFor2023Brukes } from './dateUtils';
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
    const visLegeerklæring = skalEndringeneFor2023Brukes(values);

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

    if (visLegeerklæring && legeerklæringStepIsAvailable(values)) {
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
