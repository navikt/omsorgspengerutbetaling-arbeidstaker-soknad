import { YesOrNo } from 'common/types/YesOrNo';
import { Attachment } from 'common/types/Attachment';
import { AnsettelseslengdeFormData, initialAnsettelseslengdeFormData } from './AnsettelseslengdeTypes';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export enum ArbeidsforholdFormDataFields {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn',
    ansettelseslengde = 'ansettelseslengde',
    harPerioderMedFravær = 'harPerioderMedFravær',
    fraværPerioder = 'fraværPerioder',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    fraværDager = 'fraværDager',
    dokumenter = 'dokumenter',
}

export interface ArbeidsforholdFormData {
    [ArbeidsforholdFormDataFields.navn]: string | null;
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: string;
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo;
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
    [ArbeidsforholdFormDataFields.ansettelseslengde]: AnsettelseslengdeFormData;
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværPerioder]: FraværPeriode[];
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværDager]: FraværDag[];
    [ArbeidsforholdFormDataFields.dokumenter]: Attachment[];
}

export const initialArbeidsforholdFormData: ArbeidsforholdFormData = {
    [ArbeidsforholdFormDataFields.navn]: '',
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: '',
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.ansettelseslengde]: initialAnsettelseslengdeFormData,
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.fraværPerioder]: [],
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [ArbeidsforholdFormDataFields.fraværDager]: [],
    [ArbeidsforholdFormDataFields.dokumenter]: [],
};
