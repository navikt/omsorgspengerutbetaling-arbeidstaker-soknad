import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { ArbeidsgiverDetaljer } from '../../types/SøknadApiData';
import { yesOrNoToBoolean } from './mapFunctions';
import { mapAnsettelseslengde } from './mapAnsettelseslengdeToApiData';
import { mapPeriodeTilUtbetalingsperiode } from './mapPeriodeToApiData';
import { YesOrNo } from 'common/types/YesOrNo';

export const skalInkludereArbeidsforhold = (arbeidsforholdFormData: ArbeidsforholdFormData): boolean => {
    if (
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO
    ) {
        return true;
    } else {
        return false;
    }
};

export const mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsgiverDetaljer[] => {
    return listeAvArbeidsforhold.filter((arbeidsforholdFormData: ArbeidsforholdFormData) => {
        return skalInkludereArbeidsforhold(arbeidsforholdFormData)
    }).map((arbeidsforhold: ArbeidsforholdFormData) => {
        return {
            navn: arbeidsforhold[ArbeidsforholdFormDataFields.navn],
            organisasjonsnummer: arbeidsforhold[ArbeidsforholdFormDataFields.organisasjonsnummer],
            harHattFraværHosArbeidsgiver: yesOrNoToBoolean(
                arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]
            ),
            arbeidsgiverHarUtbetaltLønn: yesOrNoToBoolean(
                arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]
            ),
            ansettelseslengde: mapAnsettelseslengde(arbeidsforhold[ArbeidsforholdFormDataFields.ansettelseslengde]),
            perioder: mapPeriodeTilUtbetalingsperiode(
                arbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær],
                arbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
            )
        };
    });
};