import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { getAlleUtbetalingsperioder } from '../utils/arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from 'app/utils/periodeUtils';
import { SøknadFormData } from '../types/SøknadFormData';
import { skalEndringeneFor2023Brukes } from '../utils/dateUtils';

export enum StepID {
    'SITUASJON' = 'situasjon',
    'FRAVÆR' = 'fravær',
    'DOKUMENTER_STENGT_SKOLE_BHG' = 'vedlegg_stengtSkoleBhg',
    'DOKUMENTER_SMITTEVERNHENSYN' = 'vedlegg_smittevernhensyn',
    'DOKUMENTER_LEGEERKLÆRING' = 'vedlegg_legeerklæring',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

const getSoknadSteps = (values: SøknadFormData): StepID[] => {
    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);

    const visLegeerklæring = skalEndringeneFor2023Brukes(values);

    const allSteps: ConfigStepHelperType[] = [
        { stepID: StepID.SITUASJON, included: true },
        { stepID: StepID.FRAVÆR, included: true },
        { stepID: StepID.DOKUMENTER_LEGEERKLÆRING, included: visLegeerklæring },
        { stepID: StepID.DOKUMENTER_STENGT_SKOLE_BHG, included: visDokumenterStengtBhgSkole },
        { stepID: StepID.DOKUMENTER_SMITTEVERNHENSYN, included: visDokumenterSmittevern },
        { stepID: StepID.MEDLEMSKAP, included: true },
        { stepID: StepID.OPPSUMMERING, included: true },
    ];

    const steps: StepID[] = allSteps.filter((step) => step.included === true).map((step) => step.stepID);

    return steps;
};

export const getSoknadStepsConfig = (values: SøknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.SOKNAD);
