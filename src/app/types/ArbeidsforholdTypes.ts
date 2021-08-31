import { YesOrNo } from 'common/types/YesOrNo';
import { Attachment } from 'common/types/Attachment';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export enum Utbetalingsårsak {
    nyoppstartetHosArbeidsgiver = 'NYOPPSTARTET_HOS_ARBEIDSGIVER',
    arbeidsgiverKonkurs = 'ARBEIDSGIVER_KONKURS',
    konfliktMedArbeidsgiver = 'KONFLIKT_MED_ARBEIDSGIVER',
}

export enum ArbeidsforholdFormDataFields {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn',
    utbetalingsårsak = 'utbetalingsårsak',
    konfliktFolklaring = 'konfliktFolklaring',
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
    [ArbeidsforholdFormDataFields.utbetalingsårsak]?: Utbetalingsårsak;
    [ArbeidsforholdFormDataFields.konfliktFolklaring]?: string;
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværPerioder]: FraværPeriode[];
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværDager]: FraværDag[];
    [ArbeidsforholdFormDataFields.dokumenter]: Attachment[];
}
