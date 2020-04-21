import { Næringstype } from '@navikt/sif-common-forms/lib';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export type ISO8601Duration = string;

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: UtenlandsoppholdApiData[];
    utenlandsoppholdSiste12Mnd: UtenlandsoppholdApiData[];
}

export interface UtenlandsoppholdApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
    erEØSLand: boolean;
}

export type YesNoSvar = boolean;

export type Spørsmål = string;

export interface YesNoSpørsmålOgSvar {
    spørsmål: Spørsmål;
    svar: YesNoSvar;
}

export interface UtbetalingsperiodeApi {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    lengde?: string; // f eks PT5H30M | "null" (type Duration)
}

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean;
}

export interface VirksomhetApiData {
    næringstyper: Næringstype[];
    fiskerErPåBladB?: boolean;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate | null;
    næringsinntekt?: number;
    navnPåVirksomheten: string;
    organisasjonsnummer?: string;
    registrertINorge: boolean;
    registrertILand?: string;
    yrkesaktivSisteTreFerdigliknedeÅrene?: {
        oppstartsdato: ApiStringDate;
    };
    varigEndring?: {
        dato: ApiStringDate;
        inntektEtterEndring: number;
        forklaring: string;
    };
    regnskapsfører?: {
        navn: string;
        telefon: string;
    };
    revisor?: {
        navn: string;
        telefon: string;
        kanInnhenteOpplysninger?: boolean;
    };
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
    organisasjoner: OrganisasjonDetaljer[];
}

export interface JobbHosNåværendeArbeidsgiver {
    merEnn4Uker: boolean;
    begrunnelse: Begrunnelse | null;
}

export enum Begrunnelse {
    ANNET_ARBEIDSFORHOLD = "ANNET_ARBEIDSFORHOLD",
    ANDRE_YTELSER = "ANDRE_YTELSER",
    LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON = "LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON",
    MILITÆRTJENESTE = "MILITÆRTJENESTE"
}

export interface SøknadApiData {
    språk: Locale;
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    jobbHosNåværendeArbeidsgiver: JobbHosNåværendeArbeidsgiver;
    vedlegg: string[];
    spørsmål: YesNoSpørsmålOgSvar[];
    arbeidsgivere: ArbeidsgiverDetaljer;
    bekreftelser: Bekreftelser;
    utbetalingsperioder: UtbetalingsperiodeApi[]; // perioder
    andreUtbetalinger: string[];
    fosterbarn: FosterbarnApi[] | null;
}

// data class Arbeidstakerutbetalingsøknad(
//     val språk: Språk,
//     val bosteder: List<Bosted>,
//     val opphold: List<Opphold>,
//     val jobbHosNåværendeArbeidsgiver: JobbHosNåværendeArbeidsgiver,
//     val spørsmål: List<SpørsmålOgSvar>,
//     val arbeidsgivere: ArbeidsgiverDetaljer,
//     val bekreftelser: Bekreftelser,
//     val utbetalingsperioder: List<Utbetalingsperiode>,
//     val andreUtbetalinger: List<String>,
//     val fosterbarn: List<FosterBarn>? = listOf()
// )
