import { stegEnListeAvArbeidsforholdIsValid } from '../components/arbeidsforholdValidations';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import {
    AnsettelseslengdeFormData,
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi
} from '../../types/AnsettelseslengdeTypes';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { Attachment } from 'common/types/Attachment';

const validAttachment: Attachment = {
    file: {
        isPersistedFile: true,
        name: 'navn-pa-fil',
        lastModified: 3,
        size: 2,
        type: 'pdf'
    },
    pending: false,
    uploaded: true,
    url: 'alskdn'
};

const gylidgPeriodeMedFravær1: Periode = {
    fom: new Date('2020-01-01'),
    tom: new Date('2020-01-02')
};

const validPerioderMedFravær: Periode[] = [gylidgPeriodeMedFravær1];

const validFraværDelerAvDag: FraværDelerAvDag = {
    dato: new Date('2020-02-01'),
    timer: 3
};

const validListeAvFraværDelerAvDag: FraværDelerAvDag[] = [validFraværDelerAvDag];

const validAnsettelseslengde1: AnsettelseslengdeFormData = {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.MER_ENN_FIRE_UKER,
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: ''
};

const validAnsettelseslengde2: AnsettelseslengdeFormData = {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON,
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: ''
};

const validAnsettelseslengde3: AnsettelseslengdeFormData = {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.INGEN,
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: 'En forklaring av noe'
};

const validArbeidsforhold1: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: 'Pengepingen',
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '1234',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.NO,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: validAnsettelseslengde1,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.perioderMedFravær]: validPerioderMedFravær,
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: validListeAvFraværDelerAvDag,
    [ArbeidsforholdFormDataFields.dokumenter]: [validAttachment]
};

const validArbeidsforhold2: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: 'Pengepingen',
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '1234',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.NO,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: validAnsettelseslengde2,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.perioderMedFravær]: validPerioderMedFravær,
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: validListeAvFraværDelerAvDag,
    [ArbeidsforholdFormDataFields.dokumenter]: []
};

const validArbeidsforhold3: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: 'Pengepingen',
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '1234',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.NO,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: validAnsettelseslengde2,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.perioderMedFravær]: validPerioderMedFravær,
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: validListeAvFraværDelerAvDag,
    [ArbeidsforholdFormDataFields.dokumenter]: []
};

const validListeAvArbeidsforhold: ArbeidsforholdFormData[] = [validArbeidsforhold1, validArbeidsforhold2];

const invalidArbeidsforhold1: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: null,
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '1234',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: validAnsettelseslengde2,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.perioderMedFravær]: validPerioderMedFravær,
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.YES,
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: validListeAvFraværDelerAvDag,
    [ArbeidsforholdFormDataFields.dokumenter]: []
};

const invalidListeAvArbeidsforhold: ArbeidsforholdFormData[] = [
    validArbeidsforhold1,
    invalidArbeidsforhold1,
    validArbeidsforhold2
];

const validGjeldende: ArbeidsforholdFormData = validArbeidsforhold3;
const validIkkeGjeldende: ArbeidsforholdFormData = validArbeidsforhold1;
const manglerSvar: ArbeidsforholdFormData = {
    ...validArbeidsforhold1,
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.UNANSWERED
};

describe('fieldValidations', () => {
    it('validates lists correctly', () => {
        expect(stegEnListeAvArbeidsforholdIsValid(validListeAvArbeidsforhold)).toBe(true);
        expect(stegEnListeAvArbeidsforholdIsValid(invalidListeAvArbeidsforhold)).toBe(false);
    });
});
