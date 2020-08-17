import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { ArbeidsgiverDetaljer } from '../../types/SøknadApiData';
import { yesOrNoToBoolean } from './mapFunctions';
import { mapAnsettelseslengde } from './mapAnsettelseslengdeToApiData';
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
                ansettelseslengde: mapAnsettelseslengde(arbeidsforhold.ansettelseslengde),
                perioder: mapFraværTilUtbetalingsperiode(arbeidsforhold.fraværPerioder, arbeidsforhold.fraværDager),
            };
        });
};
