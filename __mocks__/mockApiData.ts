import { SøknadApiData } from '../src/app/types/SøknadApiData';
import { SøkerApiResponse } from '../src/app/types/Søkerdata';
import { Utbetalingsårsak } from '../src/app/types/ArbeidsforholdTypes';
import { FraværÅrsak } from '@navikt/sif-common-forms/lib';

export const mock1: SøknadApiData = {
    språk: 'nb',
    bosteder: [
        {
            fraOgMed: '2000-01-31',
            tilOgMed: '2001-01-31',
            landkode: 'abc',
            landnavn: 'Abcland',
            erEØSLand: false,
        },
        {
            fraOgMed: '2002-01-31',
            tilOgMed: '2003-01-31',
            landkode: 'def',
            landnavn: 'Defland',
            erEØSLand: false,
        },
    ],
    opphold: [
        {
            fraOgMed: '2000-01-31',
            tilOgMed: '2001-01-31',
            landkode: 'abc',
            landnavn: 'Abcland',
            erEØSLand: false,
        },
        {
            fraOgMed: '2002-01-31',
            tilOgMed: '2003-01-31',
            landkode: 'def',
            landnavn: 'Defland',
            erEØSLand: false,
        },
    ],
    arbeidsgivere: [
        {
            navn: 'Starcraft',
            organisasjonsnummer: '999999999',
            utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            perioder: [
                {
                    fraOgMed: '2002-01-21',
                    tilOgMed: '2002-01-31',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                    årsak: FraværÅrsak.ordinært,
                },
            ],
        },
    ],
    bekreftelser: {
        harBekreftetOpplysninger: true,
        harForståttRettigheterOgPlikter: true,
    },
    vedlegg: ['location/1', 'location/3', 'location/1'],
    _vedleggSmittevern: [],
    _vedleggStengtBhgSkole: [],
};

export const sokerApiData: SøkerApiResponse = {
    aktørId: '1661665247617',
    fødselsdato: '1981-10-17',
    fødselsnummer: '17108102454',
    fornavn: 'LOTTE',
    mellomnavn: null,
    etternavn: 'FAMILIE 5',
};

export const mellomlagringResponse1 = {};
