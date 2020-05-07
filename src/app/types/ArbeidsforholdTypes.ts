import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from './PeriodeTypes';
import { Attachment } from 'common/types/Attachment';
import { AnsettelseslengdeFormData, initialAnsettelseslengdeFormData } from './AnsettelseslengdeTypes';

export enum ArbeidsforholdFormDataFields {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn',
    ansettelseslengde = 'ansettelseslengde',
    harPerioderMedFravær = 'harPerioderMedFravær',
    perioderMedFravær = 'perioderMedFravær',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dokumenter = 'dokumenter'
}

export interface ArbeidsforholdFormData {
    [ArbeidsforholdFormDataFields.navn]: string | null;
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: string;
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo;
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
    [ArbeidsforholdFormDataFields.ansettelseslengde]: AnsettelseslengdeFormData;
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.perioderMedFravær]: Periode[];
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [ArbeidsforholdFormDataFields.dokumenter]: Attachment[];
}

export enum AnnetArbeidsforholdFormDataFields {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn',
    ansettelseslengde = 'ansettelseslengde',
    perioder = 'perioder'
}

export const initialArbeidsforholdFormData: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: '',
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: initialAnsettelseslengdeFormData,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.perioderMedFravær]: [],
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: [],
    [ArbeidsforholdFormDataFields.dokumenter]: []
};
