import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Arbeidsgiver } from './Søkerdata';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';

export enum HvorforSøkerDuDirekte {
    mindreEnnFireUker = 'forutForDetteArbeidsforholdet',
    militærtjeneste = 'militærtjeneste',
    ulønnetPermisjonDirekteEtterForeldrepenger = 'ulønnetPermisjonDirekteEtterForeldrepenger',
    lovbestemtFerie = 'lovbestemtFerie',
    annet = 'annet',
    ikkeBesvart = 'ikkeBesvart'
}

export enum HvorforSøkerDuDirekteSubFields {
    harHattAnnetArbeidsforhold = 'harHattAnnetArbeidsforhold',
    mottattPengerFraNavSomLikestillesMedNoe = 'mottattPengerFraNavSomLikestillesMedNoe',
    ikkeBesvart = 'ikkeBesvart'
}

export enum ArbeidsforholdField {
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn'
}

export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'redusert' = 'redusert',
    'vetIkke' = 'vetIkke'
}

export interface Arbeidsforhold extends Arbeidsgiver {
    [ArbeidsforholdField.harHattFraværHosArbeidsgiver]: YesOrNo;
    [ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
}

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // STEG 1: Hva er din situasjon

    hvorforSøkerDuDirekte = 'hvorforSøkerDuDirekte',
    hvorforSøkerDuDirekteSubfields = 'hvorforSøkerDuDirekteSubfields',
    hvorforSØkerDuDirekteAnnetBeskrivelse = 'hvorforSØkerDuDirekteAnnetBeskrivelse',

    // STEG 2: Har betalt ut 10 første dager

    arbeidsforhold = 'arbeidsforhold',

    har_fosterbarn = 'har_fosterbarn',
    fosterbarn = 'fosterbarn',

    // STEG 3: Periode
    harPerioderMedFravær = 'harPerioderMedFravær',
    perioderMedFravær = 'perioderMedFravær',
    perioderMedFraværGroup = 'perioderMedFraværGroup',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dagerMedDelvisFraværGroup = 'dagerMedDelvisFraværGroup',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',

    // STEG 7: Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // STEG 1
    [SøknadFormField.hvorforSøkerDuDirekte]: HvorforSøkerDuDirekte;
    [SøknadFormField.hvorforSøkerDuDirekteSubfields]: HvorforSøkerDuDirekteSubFields;
    [SøknadFormField.hvorforSØkerDuDirekteAnnetBeskrivelse]: string;

    // STEG 2: Har betalt ut 10 første dager

    [SøknadFormField.arbeidsforhold]: Arbeidsforhold[];

    [SøknadFormField.har_fosterbarn]: YesOrNo;
    [SøknadFormField.fosterbarn]: Fosterbarn[];

    // STEG 3: Periode

    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.perioderMedFravær]: Periode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // STEG 1: Kvalifisering
    [SøknadFormField.hvorforSøkerDuDirekte]: HvorforSøkerDuDirekte.ikkeBesvart,
    [SøknadFormField.hvorforSøkerDuDirekteSubfields]: HvorforSøkerDuDirekteSubFields.ikkeBesvart,

    [SøknadFormField.hvorforSØkerDuDirekteAnnetBeskrivelse]: '',

    // STEG 2: Har betalt ut 10 første dager

    [SøknadFormField.arbeidsforhold]: [],

    [SøknadFormField.har_fosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],

    // STEG 3: Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};
