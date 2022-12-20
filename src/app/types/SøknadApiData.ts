import { FraværÅrsak } from '@navikt/sif-common-forms/lib';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';
import { Utbetalingsårsak, ÅrsakNyoppstartet } from './ArbeidsforholdTypes';

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

export interface Bekreftelser {
    harBekreftetOpplysninger: boolean;
    harForståttRettigheterOgPlikter: boolean;
}

export interface ArbeidsgiverDetaljer {
    navn: string;
    organisasjonsnummer: string;
    utbetalingsårsak: Utbetalingsårsak;
    årsakNyoppstartet?: ÅrsakNyoppstartet;
    konfliktForklaring?: string;
    harHattFraværHosArbeidsgiver: boolean;
    arbeidsgiverHarUtbetaltLønn: boolean;
    perioder: Utbetalingsperiode[];
}

export enum ApiAktivitet {
    ARBEIDSTAKER = 'ARBEIDSTAKER',
}

export interface Utbetalingsperiode {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    antallTimerBorte: string | null; // f eks PT5H30M | "null" (type Duration)
    antallTimerPlanlagt: string | null; // f eks PT5H30M | "null" (type Duration)
    årsak: FraværÅrsak;
    aktivitetFravær: ApiAktivitet[];
}

export interface SøknadApiData {
    språk: Locale;
    bosteder: Bosted[]; // medlemskap-siden
    opphold: Opphold[]; // hvis ja på har oppholdt seg i utlandet
    arbeidsgivere: ArbeidsgiverDetaljer[];
    bekreftelser: Bekreftelser;
    vedlegg: string[];
    _vedleggLegeerklæring: string[]; // Used in summary view
    _vedleggSmittevern: string[]; // Used in summary view
    _vedleggStengtBhgSkole: string[]; // Used in summary view
}
