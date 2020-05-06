import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';
import { Attachment } from 'common/types/Attachment';
import { AndreUtbetalinger } from './AndreUtbetalinger';
import { Ansettelseslengde, Utbetalingsperiode } from './SøknadApiData';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';

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

export enum AnsettelseslengdeFormDataFields {
    hvorLengeJobbet = 'hvorLengeJobbet',
    begrunnelse = 'begrunnelse',
    ingenAvSituasjoneneForklaring = 'ingenAvSituasjoneneForklaring'
}

export interface AnsettelseslengdeFormData {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet;
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi;
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: string;
}

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

export interface AnnetArbeidsforholdFormData {
    [AnnetArbeidsforholdFormDataFields.navn]: string | null;
    [AnnetArbeidsforholdFormDataFields.organisasjonsnummer]: null;
    [AnnetArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo;
    [AnnetArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo;
    [AnnetArbeidsforholdFormDataFields.ansettelseslengde]: AnsettelseslengdeFormData;
    [AnnetArbeidsforholdFormDataFields.perioder]: Utbetalingsperiode[];
}

export const initialAnsettelseslengdeFormData: AnsettelseslengdeFormData = {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: ''
};

export const initialAnnetArbeidsforhold: AnnetArbeidsforholdFormData = {
    [AnnetArbeidsforholdFormDataFields.navn]: '',
    [AnnetArbeidsforholdFormDataFields.organisasjonsnummer]: null,
    [AnnetArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: YesOrNo.UNANSWERED,
    [AnnetArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
    [AnnetArbeidsforholdFormDataFields.ansettelseslengde]: initialAnsettelseslengdeFormData,
    [AnnetArbeidsforholdFormDataFields.perioder]: []
};

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // STEG 1: Situasjon
    arbeidsforhold = 'arbeidsforhold',
    harAnnetArbeidsforhold = 'harAnnetArbeidsforhold',
    annetArbeidsforhold = 'annetArbeidsforhold',

    harFosterbarn = 'harFosterbarn',
    fosterbarn = 'fosterbarn',

    // STEG 2: Periode

    // STEG 3: ANNET
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',
    har_søkt_andre_utbetalinger = 'har_søkt_andre_utbetalinger',
    andre_utbetalinger = 'andre_utbetalinger',

    // STEG 4: Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd'
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // STEG 1: Situasjon
    [SøknadFormField.arbeidsforhold]: ArbeidsforholdFormData[];
    [SøknadFormField.harAnnetArbeidsforhold]: YesOrNo;
    [SøknadFormField.annetArbeidsforhold]: AnnetArbeidsforholdFormData;

    [SøknadFormField.harFosterbarn]: YesOrNo;
    [SøknadFormField.fosterbarn]: Fosterbarn[];

    // STEG 2:

    // STEG 3
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo;
    [SøknadFormField.andre_utbetalinger]: AndreUtbetalinger[];

    // STEG 4:
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // STEG 1: Situasjon
    [SøknadFormField.arbeidsforhold]: [],
    [SøknadFormField.harAnnetArbeidsforhold]: YesOrNo.UNANSWERED,
    [SøknadFormField.annetArbeidsforhold]: initialAnnetArbeidsforhold,

    [SøknadFormField.harFosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],

    // STEG 2:

    // STEG 3
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],

    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andre_utbetalinger]: [],

    // STEG 4:
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};

export const isSøknadFormData = (søknadFormData: any): søknadFormData is SøknadFormData => {
    if (
        søknadFormData &&
        søknadFormData[SøknadFormField.harForståttRettigheterOgPlikter] !== undefined
        // TODO: Denne kan gjøres mer grundig
    ) {
        return true;
    }
    return false;
};
