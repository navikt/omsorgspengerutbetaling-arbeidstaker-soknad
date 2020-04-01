import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';

// const Q = SøknadFormField;

const EgenutbetalingConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    // [Q.har_utbetalt_ti_dager]: {
    //     isAnswered: ({ har_utbetalt_ti_dager }) => yesOrNoIsAnswered(har_utbetalt_ti_dager)
    // }
};

export const EgenutbetalingQuestions = Questions<SøknadFormData, SøknadFormField>(EgenutbetalingConfig);
