import { Begrunnelse, SøknadApiData } from '../../types/SøknadApiData';

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
                navn: "Byggmakker",
                organisasjonsnummer: "9999999",
                harHattFraværHosArbeidsgiver: true,
                arbeidsgiverHarUtbetaltLønn: false
            },
            {
                navn: "Norsk tipping",
                organisasjonsnummer: "9999999",
                harHattFraværHosArbeidsgiver: false,
                arbeidsgiverHarUtbetaltLønn: false
            }
        ]
    },
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
    fosterbarn: []
};