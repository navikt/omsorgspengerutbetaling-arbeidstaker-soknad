import { Utbetalingsårsak } from '../ArbeidsforholdTypes';
import { SøknadApiData } from '../SøknadApiData';

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
            utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
            perioder: [
                {
                    fraOgMed: '2020-05-01',
                    tilOgMed: '2020-05-02',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-05-04',
                    tilOgMed: '2020-05-05',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-05-06',
                    tilOgMed: '2020-05-06',
                    antallTimerPlanlagt: 'PT5H0M',
                    antallTimerBorte: 'PT5H0M',
                },
                {
                    fraOgMed: '2020-05-07',
                    tilOgMed: '2020-05-07',
                    antallTimerPlanlagt: 'PT7H0M',
                    antallTimerBorte: 'PT7H0M',
                },
            ],
        },
        {
            navn: 'Arbeids- og sosialdepartementet',
            organisasjonsnummer: '123451235',
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
            perioder: [
                {
                    fraOgMed: '2020-04-01',
                    tilOgMed: '2020-04-02',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-04-03',
                    tilOgMed: '2020-04-04',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-04-06',
                    tilOgMed: '2020-04-06',
                    antallTimerPlanlagt: 'PT2H30M',
                    antallTimerBorte: 'PT2H30M',
                },
                {
                    fraOgMed: '2020-04-07',
                    tilOgMed: '2020-04-07',
                    antallTimerPlanlagt: 'PT4H0M',
                    antallTimerBorte: 'PT4H0M',
                },
            ],
        },
        {
            navn: 'Blizzard',
            organisasjonsnummer: '',
            harHattFraværHosArbeidsgiver: true,
            arbeidsgiverHarUtbetaltLønn: false,
            utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
            perioder: [
                {
                    fraOgMed: '2020-03-02',
                    tilOgMed: '2020-03-03',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-03-04',
                    tilOgMed: '2020-03-05',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-03-09',
                    tilOgMed: '2020-03-09',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
                {
                    fraOgMed: '2020-03-10',
                    tilOgMed: '2020-03-10',
                    antallTimerPlanlagt: null,
                    antallTimerBorte: null,
                },
            ],
        },
    ],
    bekreftelser: {
        harBekreftetOpplysninger: true,
        harForståttRettigheterOgPlikter: true,
    },
    hjemmePgaSmittevernhensyn: false,
    hjemmePgaStengtBhgSkole: false,
    vedlegg: [],
    _vedleggSmittevern: [],
    _vedleggStengtBhgSkole: [],
};
