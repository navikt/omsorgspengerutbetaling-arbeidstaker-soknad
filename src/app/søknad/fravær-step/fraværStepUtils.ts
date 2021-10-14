import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

export const cleanFraværForArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
    return {
        ...arbeidsforhold,
        fraværPerioder:
            arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværPerioder],
        fraværDager:
            arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværDager],
    };
};

export const cleanupStep = (søknadFormData: SøknadFormData): SøknadFormData => {
    const listeAvArbeidsforhold = søknadFormData[SøknadFormField.arbeidsforhold];

    return {
        ...søknadFormData,
        arbeidsforhold: listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) =>
            cleanFraværForArbeidsforhold(arbeidsforhold)
        ),
    };
};
