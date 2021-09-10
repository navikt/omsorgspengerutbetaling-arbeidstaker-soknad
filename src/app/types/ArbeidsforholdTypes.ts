import { YesOrNo } from 'common/types/YesOrNo';
import { Attachment } from 'common/types/Attachment';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export enum Utbetalingsårsak {
    nyoppstartetHosArbeidsgiver = 'NYOPPSTARTET_HOS_ARBEIDSGIVER',
    arbeidsgiverKonkurs = 'ARBEIDSGIVER_KONKURS',
    konfliktMedArbeidsgiver = 'KONFLIKT_MED_ARBEIDSGIVER',
    ikkeBesvart = 'IKKE_BESVART',
}

export enum ÅrsakNyoppstartet {
    jobbetHosAnnenArbeidsgiver = 'JOBBET_HOS_ANNEN_ARBEIDSGIVER',
    varFrilanser = 'VAR_FRILANSER',
    varSelvstendige = 'VAR_SELVSTENDIGE',
    søkteAndreUtbetalinger = 'SØKTE_ANDRE_UTBETALINGER',
    arbeidIUtlandet = 'ARBEID_I_UTLANDET',
    utøvdeMilitær = 'UTØVDE_MILITÆR',
    annet = 'ANNET',
}

export enum ArbeidsforholdFormDataFields {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn',
    utbetalingsårsak = 'utbetalingsårsak',
    årsakNyoppstartet = 'årsakNyoppstartet',
    konfliktForklaring = 'konfliktForklaring',
    harPerioderMedFravær = 'harPerioderMedFravær',
    fraværPerioder = 'fraværPerioder',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    fraværDager = 'fraværDager',
    dokumenter = 'dokumenter',
}

export interface ArbeidsforholdFormData {
    [ArbeidsforholdFormDataFields.navn]: string;
    [ArbeidsforholdFormDataFields.organisasjonsnummer]: string;
    [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo;
    [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
    [ArbeidsforholdFormDataFields.utbetalingsårsak]: Utbetalingsårsak;
    [ArbeidsforholdFormDataFields.årsakNyoppstartet]?: ÅrsakNyoppstartet;
    [ArbeidsforholdFormDataFields.konfliktForklaring]?: string;
    [ArbeidsforholdFormDataFields.harPerioderMedFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværPerioder]: FraværPeriode[];
    [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: YesOrNo;
    [ArbeidsforholdFormDataFields.fraværDager]: FraværDag[];
    [ArbeidsforholdFormDataFields.dokumenter]: Attachment[];
}
