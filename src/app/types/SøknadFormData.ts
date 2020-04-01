import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { NBarn } from '../components/formik-n-barn/n-barn-types';
import { Arbeidsgiver } from './Søkerdata';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';

export enum HvorforSøkerDuDirekte {
    forutForDetteArbeidsforholdet = 'forutForDetteArbeidsforholdet',
    inntektFraNav = 'inntektFraNav',
    militærtjeneste = 'militærtjeneste',
    ulønnetPermisjonDirekteEtterForeldrepenger = 'ulønnetPermisjonDirekteEtterForeldrepenger',
    lovbestemtFerie = 'lovbestemtFerie',
    annet = 'annet',
    ikkeBesvart = 'ikkeBesvart'
}

export enum ArbeidsforholdField {
    erAnsattIPerioden = 'erAnsattIPerioden',
    skalJobbe = 'skalJobbe',
    timerEllerProsent = 'timerEllerProsent',
    jobberNormaltTimer = 'jobberNormaltTimer',
    skalJobbeTimer = 'skalJobbeTimer',
    skalJobbeProsent = 'skalJobbeProsent'
}

export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'redusert' = 'redusert',
    'vetIkke' = 'vetIkke'
}

export interface Arbeidsforhold extends Arbeidsgiver {
    [ArbeidsforholdField.erAnsattIPerioden]?: YesOrNo;
    [ArbeidsforholdField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdField.jobberNormaltTimer]?: number;
    [ArbeidsforholdField.skalJobbeTimer]?: number;
    [ArbeidsforholdField.skalJobbeProsent]?: number;
}


export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // STEG 1: Hva er din situasjon

    nBarn = 'nBarn',

    stegEnSpørsmålEn = 'stegEnSpørsmålEn',
    stegEnSpørsmålTo = 'stegEnSpørsmålTo',
    stegEnSpørsmålTre = 'stegEnSpørsmålTre',
    stegEnSpørsmålFire = 'stegEnSpørsmålFire',

    forutForDetteArbeidsforholdet = 'forutForDetteArbeidsforholdet',
    militærtjeneste = 'militærtjeneste',
    ulønnetPermisjonDirekteEtterForeldrepenger = 'ulønnetPermisjonDirekteEtterForeldrepenger',
    lovbestemtFerie = 'lovbestemtFerie',
    annet = 'annet',

    // STEG 2: Har betalt ut 10 første dager

    arbeidsforhold = 'arbeidsforhold',

    har_fosterbarn = 'har_fosterbarn',
    fosterbarn = 'fosterbarn',

    hvorforSøkerDuDirekte = 'hvorforSøkerDuDirekte',
    hvorforSØkerDuDirekteAnnetBeskrivelse = 'hvorforSØkerDuDirekteAnnetBeskrivelse',

    har_utbetalt_ti_dager = 'har_utbetalt_ti_dager',
    innvilget_utvidet_rett = 'innvilget_utvidet_rett',
    ingen_andre_barn_under_tolv = 'ingen_andre_barn_under_tolv',
    fisker_på_blad_B = 'fisker_på_blad_B',
    frivillig_forsikring = 'frivillig_forsikring',
    nettop_startet_selvstendig_frilanser = 'nettop_startet_selvstendig_frilanser',

    // STEG 3: Periode
    harPerioderMedFravær = 'harPerioderMedFravær',
    perioderMedFravær = 'perioderMedFravær',
    perioderMedFraværGroup = 'perioderMedFraværGroup',
    harDagerMedDelvisFravær = 'harDagerMedDelvisFravær',
    dagerMedDelvisFravær = 'dagerMedDelvisFravær',
    dagerMedDelvisFraværGroup = 'dagerMedDelvisFraværGroup',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',

    // STEG 4: Conditional perioder i utlandet
    hvis_utenlandsopphold_en_test_verdi = 'hvis_utenlandsopphold_en_test_verdi',

    // STEG 5: Legeerklæring
    legeerklæring = 'legeerklæring',

    // STEG 6: Inntekt
    frilans_harHattInntektSomFrilanser = 'frilans_harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_virksomheter = 'selvstendig_virksomheter',

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

    [SøknadFormField.nBarn]: NBarn;

    [SøknadFormField.stegEnSpørsmålEn]: YesOrNo;
    [SøknadFormField.stegEnSpørsmålTo]: YesOrNo;
    [SøknadFormField.stegEnSpørsmålTre]: YesOrNo;
    [SøknadFormField.stegEnSpørsmålFire]: YesOrNo;

    [SøknadFormField.forutForDetteArbeidsforholdet]: YesOrNo;
    [SøknadFormField.militærtjeneste]: YesOrNo;
    [SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger]: YesOrNo;
    [SøknadFormField.lovbestemtFerie]: YesOrNo;
    [SøknadFormField.annet]: YesOrNo;

    // STEG 2: Har betalt ut 10 første dager

    [SøknadFormField.arbeidsforhold]: Arbeidsforhold[];

    [SøknadFormField.har_fosterbarn]: YesOrNo;
    [SøknadFormField.fosterbarn]: Fosterbarn[];

    [SøknadFormField.hvorforSøkerDuDirekte]: HvorforSøkerDuDirekte;
    [SøknadFormField.hvorforSØkerDuDirekteAnnetBeskrivelse]: string;

    [SøknadFormField.har_utbetalt_ti_dager]: YesOrNo;
    [SøknadFormField.innvilget_utvidet_rett]: YesOrNo;
    [SøknadFormField.ingen_andre_barn_under_tolv]: YesOrNo;
    [SøknadFormField.fisker_på_blad_B]: YesOrNo;
    [SøknadFormField.frivillig_forsikring]: YesOrNo;
    [SøknadFormField.nettop_startet_selvstendig_frilanser]: YesOrNo;

    // STEG 3: Periode

    [SøknadFormField.harPerioderMedFravær]: YesOrNo;
    [SøknadFormField.perioderMedFravær]: Periode[];
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo;
    [SøknadFormField.dagerMedDelvisFravær]: FraværDelerAvDag[];
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    // STEG 4: Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo;

    // STEG 5: Legeerklæring
    [SøknadFormField.legeerklæring]: Attachment[];

    // STEG 6: Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo;
    [SøknadFormField.frilans_startdato]?: Date;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [SøknadFormField.selvstendig_virksomheter]?: Virksomhet[];

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

// const mockPeriode = { fom: undefined, tom: undefined } as any;

// const ugyldigTimer: any = 'x';
export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // STEG 1: Kvalifisering

    [SøknadFormField.nBarn]: NBarn.UNANSWERED,

    [SøknadFormField.stegEnSpørsmålEn]: YesOrNo.UNANSWERED,
    [SøknadFormField.stegEnSpørsmålTo]: YesOrNo.UNANSWERED,
    [SøknadFormField.stegEnSpørsmålTre]: YesOrNo.UNANSWERED,
    [SøknadFormField.stegEnSpørsmålFire]: YesOrNo.UNANSWERED,

    [SøknadFormField.forutForDetteArbeidsforholdet]: YesOrNo.UNANSWERED,
    [SøknadFormField.militærtjeneste]: YesOrNo.UNANSWERED,
    [SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger]: YesOrNo.UNANSWERED,
    [SøknadFormField.lovbestemtFerie]: YesOrNo.UNANSWERED,
    [SøknadFormField.annet]: YesOrNo.UNANSWERED,

    // STEG 2: Har betalt ut 10 første dager

    [SøknadFormField.arbeidsforhold]: [],

    [SøknadFormField.har_fosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],

    [SøknadFormField.hvorforSøkerDuDirekte]: HvorforSøkerDuDirekte.ikkeBesvart,
    [SøknadFormField.hvorforSØkerDuDirekteAnnetBeskrivelse]: '',

    [SøknadFormField.har_utbetalt_ti_dager]: YesOrNo.UNANSWERED,
    [SøknadFormField.innvilget_utvidet_rett]: YesOrNo.UNANSWERED,
    [SøknadFormField.ingen_andre_barn_under_tolv]: YesOrNo.UNANSWERED,
    [SøknadFormField.fisker_på_blad_B]: YesOrNo.UNANSWERED,
    [SøknadFormField.frivillig_forsikring]: YesOrNo.UNANSWERED,
    [SøknadFormField.nettop_startet_selvstendig_frilanser]: YesOrNo.UNANSWERED,

    // STEG 3: Periode
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],

    // STEG 4: Conditional perioder i utlandet
    [SøknadFormField.hvis_utenlandsopphold_en_test_verdi]: YesOrNo.UNANSWERED,

    // STEG 5: Legeerklæring
    [SøknadFormField.legeerklæring]: [],

    // STEG 6: Inntekt
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,

    // STEG 7: Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};
