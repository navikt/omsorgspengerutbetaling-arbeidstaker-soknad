import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export type ISO8601Duration = string;

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: Bosted[];
    utenlandsoppholdSiste12Mnd: Bosted[];
}

export interface Bosted {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
    erEØSLand: boolean;
}

export type Opphold = Bosted;

export type YesNoSvar = boolean;

export type Spørsmål = string;

export interface YesNoSpørsmålOgSvar {
    spørsmål: Spørsmål;
    svar: YesNoSvar;
}


export interface FosterbarnApi {
    fødselsnummer: string;
    fornavn: string | null;
    etternavn: string | null;
}

export interface Bekreftelser {
    harBekreftetOpplysninger: boolean;
    harForståttRettigheterOgPlikter: boolean;
}

export interface OrganisasjonDetaljer {
    navn: string;
    organisasjonsnummer: string;
    harHattFraværHosArbeidsgiver: boolean;
    arbeidsgiverHarUtbetaltLønn: boolean;
}

export interface ArbeidsgiverDetaljer {
    navn: string | null;
    organisasjonsnummer: string | null;
    harHattFraværHosArbeidsgiver: boolean;
    arbeidsgiverHarUtbetaltLønn: boolean;
    ansettelseslengde: Ansettelseslengde;
    perioder: Utbetalingsperiode[];
}

export interface Ansettelseslengde {
    merEnn4Uker: boolean;
    begrunnelse: Begrunnelse | null;
    ingenAvSituasjoneneForklaring: string | null;
}

export enum Begrunnelse {
    ANNET_ARBEIDSFORHOLD = "ANNET_ARBEIDSFORHOLD",
    ANDRE_YTELSER = "ANDRE_YTELSER",
    LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON = "LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON",
    MILITÆRTJENESTE = "MILITÆRTJENESTE",
    INGEN_AV_SITUASJONENE = "INGEN_AV_SITUASJONENE"
}

export interface JobbHosNåværendeArbeidsgiver {
    merEnn4Uker: boolean;
    begrunnelse: Begrunnelse | null;
}

export interface Utbetalingsperiode {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    lengde: string | null; // f eks PT5H30M | "null" (type Duration)
}

export interface SøknadApiData {
    språk: Locale;
    bosteder: Bosted[]; // medlemskap-siden
    opphold: Opphold[]; // hvis ja på har oppholdt seg i utlandet
    arbeidsgivere: ArbeidsgiverDetaljer[];
    bekreftelser: Bekreftelser;
    andreUtbetalinger: string[];
    fosterbarn: FosterbarnApi[] | null;
    hjemmePgaSmittevernhensyn: boolean;
    vedlegg: string[];
}
