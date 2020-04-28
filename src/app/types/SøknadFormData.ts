import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Arbeidsgiver } from './Søkerdata';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';
import { Attachment } from 'common/types/Attachment';
import { AndreUtbetalinger } from './AndreUtbetalinger';

export enum HvorLengeJobbet {
    MINDRE_ENN_FIRE_UKER = 'MINDRE_ENN_FIRE_UKER',
    MER_ENN_FIRE_UKER = 'MER_ENN_FIRE_UKER',
    IKKE_BESVART = 'IKKE_BESVART'
}

export enum HvorLengeJobbetFordi {
    ANNET_ARBEIDSFORHOLD = 'ANNET_ARBEIDSFORHOLD',
    ANDRE_YTELSER = 'ANDRE_YTELSER',
    LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON = 'LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON',
    MILITÆRTJENESTE = 'MILITÆRTJENESTE',
    INGEN = 'INGEN',
    IKKE_BESVART = 'IKKE_BESVART'
}

export enum ArbeidsforholdField {
    harHattFraværHosArbeidsgiver = 'harHattFraværHosArbeidsgiver',
    arbeidsgiverHarUtbetaltLønn = 'arbeidsgiverHarUtbetaltLønn'
}

export interface Arbeidsforhold extends Arbeidsgiver {
    [ArbeidsforholdField.harHattFraværHosArbeidsgiver]: YesOrNo;
    [ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
}

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // STEG 1: Hva er din situasjon
    hvorLengeHarDuJobbetHosNåværendeArbeidsgiver = 'hvorLengeHarDuJobbetHosNåværendeArbeidsgiver',
    hvorLengeJobbetFordi = 'hvorLengeJobbetFordi',

    // Optional vedlegg step
    dokumenter = 'dokumenter',

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

    har_søkt_andre_utbetalinger = 'har_søkt_andre_utbetalinger',
    andre_utbetalinger = 'andre_utbetalinger',

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

    [SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver]: HvorLengeJobbet;
    [SøknadFormField.hvorLengeJobbetFordi]: HvorLengeJobbetFordi;

    // Optional vedlegg step
    [SøknadFormField.dokumenter]: Attachment[];

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

    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo;
    [SøknadFormField.andre_utbetalinger]: AndreUtbetalinger[];

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
    [SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver]: HvorLengeJobbet.IKKE_BESVART,
    [SøknadFormField.hvorLengeJobbetFordi]: HvorLengeJobbetFordi.IKKE_BESVART,

    // Optional vedlegg step
    [SøknadFormField.dokumenter]: [],

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

    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andre_utbetalinger]: [],

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};

export const isFormData = (formdata: unknown): formdata is FormData => true; // TODO: Implement