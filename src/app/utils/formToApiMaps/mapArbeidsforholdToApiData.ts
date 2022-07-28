import { ArbeidsforholdFormData, Utbetalingsårsak } from '../../types/ArbeidsforholdTypes';
import { ArbeidsgiverDetaljer } from '../../types/SøknadApiData';
import { mapFraværTilUtbetalingsperiode } from './mapPeriodeToApiData';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

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
                harHattFraværHosArbeidsgiver: arbeidsforhold.harHattFraværHosArbeidsgiver === YesOrNo.YES,
                arbeidsgiverHarUtbetaltLønn: arbeidsforhold.arbeidsgiverHarUtbetaltLønn === YesOrNo.YES,
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
