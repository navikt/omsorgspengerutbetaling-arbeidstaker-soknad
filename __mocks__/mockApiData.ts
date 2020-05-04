import { Begrunnelse, SøknadApiData } from '../src/app/types/SøknadApiData';
import { SøkerApiResponse } from '../src/app/types/Søkerdata';

export const mock1: SøknadApiData = {
    språk: 'nb',
    bekreftelser: {
        harForståttRettigheterOgPlikter: false,
        harBekreftetOpplysninger: false
    },
    jobbHosNåværendeArbeidsgiver: {
        merEnn4Uker: false,
        begrunnelse: Begrunnelse.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
    },
    vedlegg: [],
    spørsmål: [],
    utbetalingsperioder: [
        {
            fraOgMed: '2020-03-02',
            tilOgMed: '2020-03-03'
        },
        {
            fraOgMed: '2020-03-04',
            tilOgMed: '2020-03-05'
        },
        {
            fraOgMed: '2020-03-09',
            tilOgMed: '2020-03-09',
            lengde: 'PT5H0M'
        },
        {
            fraOgMed: '2020-03-10',
            tilOgMed: '2020-03-10',
            lengde: 'PT4H0M'
        }
    ],
    bosteder: [
        {
            landnavn: 'Vietnam',
            landkode: 'VN',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-10',
            erEØSLand: true
        },
        {
            landnavn: 'Madagaskar',
            landkode: 'MG',
            fraOgMed: '2020-04-21',
            tilOgMed: '2020-04-30',
            erEØSLand: true
        }
    ],
    opphold: [
        {
            landnavn: 'Hviterussland',
            landkode: 'BY',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-15',
            erEØSLand: true
        },
        {
            landnavn: 'Wallis- og Futunaøyene',
            landkode: 'WF',
            fraOgMed: '2020-02-24',
            tilOgMed: '2020-02-29',
            erEØSLand: true
        }
    ],
    arbeidsgivere: {
        organisasjoner: [
            {
                navn: 'Pengebingen',
                organisasjonsnummer: '9999999',
                harHattFraværHosArbeidsgiver: true,
                arbeidsgiverHarUtbetaltLønn: false
            },
            {
                navn: 'Blizard',
                organisasjonsnummer: '9999999',
                harHattFraværHosArbeidsgiver: false,
                arbeidsgiverHarUtbetaltLønn: false
            }
        ]
    },
    andreUtbetalinger: [],
    fosterbarn: []
};

export const mock2: SøknadApiData = {
    språk: 'nb',
    bekreftelser: {
        harForståttRettigheterOgPlikter: false,
        harBekreftetOpplysninger: false
    },
    jobbHosNåværendeArbeidsgiver: {
        merEnn4Uker: true,
        begrunnelse: null
    },
    vedlegg: [],
    spørsmål: [],
    utbetalingsperioder: [
        {
            fraOgMed: '2020-03-02',
            tilOgMed: '2020-03-03'
        },
        {
            fraOgMed: '2020-03-04',
            tilOgMed: '2020-03-05'
        },
        {
            fraOgMed: '2020-03-09',
            tilOgMed: '2020-03-09',
            lengde: 'PT5H0M'
        },
        {
            fraOgMed: '2020-03-10',
            tilOgMed: '2020-03-10',
            lengde: 'PT4H0M'
        }
    ],
    bosteder: [
        {
            landnavn: 'Vietnam',
            landkode: 'VN',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-10',
            erEØSLand: true
        },
        {
            landnavn: 'Madagaskar',
            landkode: 'MG',
            fraOgMed: '2020-04-21',
            tilOgMed: '2020-04-30',
            erEØSLand: true
        }
    ],
    opphold: [
        {
            landnavn: 'Hviterussland',
            landkode: 'BY',
            fraOgMed: '2020-02-01',
            tilOgMed: '2020-02-15',
            erEØSLand: true
        },
        {
            landnavn: 'Wallis- og Futunaøyene',
            landkode: 'WF',
            fraOgMed: '2020-02-24',
            tilOgMed: '2020-02-29',
            erEØSLand: true
        }
    ],
    arbeidsgivere: {
        organisasjoner: []
    },
    andreUtbetalinger: [],
    fosterbarn: []
};

export const sokerApiData: SøkerApiResponse = {
    'aktørId': '1661665247617',
    'fødselsdato': '1981-10-17',
    'fødselsnummer': '17108102454',
    'fornavn': 'LOTTE',
    'mellomnavn': null,
    'etternavn': 'FAMILIE 5',
    'myndig': true
};

export const mellomlagringResponse1 = {}
