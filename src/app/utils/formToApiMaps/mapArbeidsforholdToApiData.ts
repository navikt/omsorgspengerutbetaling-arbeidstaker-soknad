import { ArbeidsforholdFormData, Utbetalingsårsak } from '../../types/ArbeidsforholdTypes';
import { ArbeidsgiverDetaljer } from '../../types/SøknadApiData';
import { yesOrNoToBoolean } from './mapFunctions';
import { mapFraværTilUtbetalingsperiode } from './mapPeriodeToApiData';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';

export const mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsgiverDetaljer[] => {
    return listeAvArbeidsforhold
        .filter((arbeidsforholdFormData: ArbeidsforholdFormData) => {
            return skalInkludereArbeidsforhold(arbeidsforholdFormData);
        })
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return {
                navn: arbeidsforhold.navn,
                organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
                harHattFraværHosArbeidsgiver: yesOrNoToBoolean(arbeidsforhold.harHattFraværHosArbeidsgiver),
                arbeidsgiverHarUtbetaltLønn: yesOrNoToBoolean(arbeidsforhold.arbeidsgiverHarUtbetaltLønn),
                utbetalingsårsak: arbeidsforhold.utbetalingsårsak,
                årsakNyoppstartet:
                    arbeidsforhold.utbetalingsårsak === Utbetalingsårsak.nyoppstartetHosArbeidsgiver &&
                    arbeidsforhold.årsakNyoppstartet
                        ? arbeidsforhold.årsakNyoppstartet
                        : undefined,
                konfliktForklaring:
                    arbeidsforhold.utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver &&
                    arbeidsforhold.konfliktForklaring
                        ? arbeidsforhold.konfliktForklaring
                        : undefined,
                perioder: mapFraværTilUtbetalingsperiode(arbeidsforhold.fraværPerioder, arbeidsforhold.fraværDager),
            };
        });
};
