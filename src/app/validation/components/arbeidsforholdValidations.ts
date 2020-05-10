import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import { isString } from 'formik';

export const arbeidsforholdFormDataPartOneIsValid = (arbeidsforholdFormData: ArbeidsforholdFormData): boolean => {
    const organisasjonsnummer: string = arbeidsforholdFormData[ArbeidsforholdFormDataFields.organisasjonsnummer];
    const navn: string | null = arbeidsforholdFormData[ArbeidsforholdFormDataFields.navn];

    const harHattFraværHosArbeidsgiver: YesOrNo =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver];
    const arbeidsgiverHarUtbetaltLønn: YesOrNo =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn];

    if (
        harHattFraværHosArbeidsgiver === YesOrNo.NO ||
        (harHattFraværHosArbeidsgiver === YesOrNo.YES && arbeidsgiverHarUtbetaltLønn === YesOrNo.YES) ||
        (harHattFraværHosArbeidsgiver === YesOrNo.YES &&
            arbeidsgiverHarUtbetaltLønn === YesOrNo.NO &&
            isString(navn) &&
            navn.length > 0)
    ) {
        return true;
    } else {
        return false;
    }
};

export const stegEnArbeidsforholdValid = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return listeAvArbeidsforhold
        .map((arbeidsforholdFormData: ArbeidsforholdFormData) =>
            arbeidsforholdFormDataPartOneIsValid(arbeidsforholdFormData)
        )
        .reduceRight((prev, curr) => {
            if (prev === false) {
                return prev;
            } else {
                return curr;
            }
        }, true);
};

export const stegEnAnnetArbeidsforholdIsValid = (annetArbeidsforhold: ArbeidsforholdFormData): boolean => {
    return arbeidsforholdFormDataPartOneIsValid(annetArbeidsforhold);
};
