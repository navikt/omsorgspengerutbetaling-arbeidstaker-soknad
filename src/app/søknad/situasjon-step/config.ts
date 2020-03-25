import { QuestionConfig, Questions } from '@navikt/sif-common-question-config';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoIsAnswered';

const Q = SøknadFormField;

const SituasjonStepConfig: QuestionConfig<SøknadFormData, SøknadFormField> = {
    [Q.forutForDetteArbeidsforholdet]: {
        isAnswered: ({ forutForDetteArbeidsforholdet }) => yesOrNoIsAnswered(forutForDetteArbeidsforholdet)
    },
    [Q.militærtjeneste]: {
        isAnswered: ({ militærtjeneste }) => yesOrNoIsAnswered(militærtjeneste)
    },
    [Q.ulønnetPermisjonDirekteEtterForeldrepenger]: {
        isAnswered: ({ ulønnetPermisjonDirekteEtterForeldrepenger }) =>
            yesOrNoIsAnswered(ulønnetPermisjonDirekteEtterForeldrepenger)
    },
    [Q.lovbestemtFerie]: {
        isAnswered: ({ lovbestemtFerie }) => yesOrNoIsAnswered(lovbestemtFerie)
    },
    [Q.annet]: {
        isAnswered: ({ annet }) => yesOrNoIsAnswered(annet)
    }
};

export const SituasjonStepQuestions = Questions<SøknadFormData, SøknadFormField>(SituasjonStepConfig);
