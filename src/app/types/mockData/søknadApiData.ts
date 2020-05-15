import { Begrunnelse, SøknadApiData } from '../SøknadApiData';

export const gyldigSøknadApiData1: SøknadApiData = {
    språk: 'nb',
    bosteder: [],
    opphold: [],
    arbeidsgivere: [
        {
            navn: 'Arbeids- og velferdsetaten',
            organisasjonsnummer: '123451234',
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            ansettelseslengde: {
                merEnn4Uker: false,
                begrunnelse: Begrunnelse.ANNET_ARBEIDSFORHOLD,
                ingenAvSituasjoneneForklaring: null
            },
            perioder: [
                {
                    fraOgMed: '2020-05-01',
                    tilOgMed: '2020-05-02',
                    lengde: null
                },
                {
                    fraOgMed: '2020-05-04',
                    tilOgMed: '2020-05-05',
                    lengde: null
                },
                {
                    fraOgMed: '2020-05-06',
                    tilOgMed: '2020-05-06',
                    lengde: 'PT1H0M'
                },
                {
                    fraOgMed: '2020-05-07',
                    tilOgMed: '2020-05-07',
                    lengde: 'PT2H30M'
                }
            ]
        },
        {
            navn: 'Arbeids- og sosialdepartementet',
            organisasjonsnummer: '123451235',
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            ansettelseslengde: {
                merEnn4Uker: false,
                begrunnelse: Begrunnelse.ANNET_ARBEIDSFORHOLD,
                ingenAvSituasjoneneForklaring: null
            },
            perioder: [
                {
                    fraOgMed: '2020-04-01',
                    tilOgMed: '2020-04-02',
                    lengde: null
                },
                {
                    fraOgMed: '2020-04-03',
                    tilOgMed: '2020-04-04',
                    lengde: null
                },
                {
                    fraOgMed: '2020-04-06',
                    tilOgMed: '2020-04-06',
                    lengde: 'PT2H30M'
                },
                {
                    fraOgMed: '2020-04-07',
                    tilOgMed: '2020-04-07',
                    lengde: 'PT4H0M'
                }
            ]
        },
        {
            navn: 'Blizzard',
            organisasjonsnummer: '',
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            ansettelseslengde: {
                merEnn4Uker: false,
                begrunnelse: Begrunnelse.ANNET_ARBEIDSFORHOLD,
                ingenAvSituasjoneneForklaring: null
            },
            perioder: [
                {
                    fraOgMed: '2020-03-02',
                    tilOgMed: '2020-03-03',
                    lengde: null
                },
                {
                    fraOgMed: '2020-03-04',
                    tilOgMed: '2020-03-05',
                    lengde: null
                },
                {
                    fraOgMed: '2020-03-09',
                    tilOgMed: '2020-03-09',
                    lengde: 'PT3H0M'
                },
                {
                    fraOgMed: '2020-03-10',
                    tilOgMed: '2020-03-10',
                    lengde: 'PT5H0M'
                }
            ]
        }
    ],
    bekreftelser: {
        harBekreftetOpplysninger: true,
        harForståttRettigheterOgPlikter: true
    },
    andreUtbetalinger: [],
    fosterbarn: null,
    hjemmePgaSmittevernhensyn: false,
    vedlegg: []
};
