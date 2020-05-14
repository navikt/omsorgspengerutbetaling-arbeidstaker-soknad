import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import { isString } from 'formik';
import { ansettelsesLengdeIsValid } from './ansettelsesLengdeValidations';
import { delvisFraværIsValid, perioderIsValid } from '../../søknad/periode-step/periodeStepConfig';

export const evaluatePrevAndCurrent = (prev: boolean, curr: boolean) => {
    if (prev === false) {
        return prev;
    } else {
        return curr;
    }
};

export const arbeidsforholdFormDataPartOneIsValid = (arbeidsforholdFormData: ArbeidsforholdFormData): boolean => {
    const harHattFraværHosArbeidsgiver: YesOrNo =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver];
    const arbeidsgiverHarUtbetaltLønn: YesOrNo =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn];
    if (
        harHattFraværHosArbeidsgiver === YesOrNo.NO ||
        (harHattFraværHosArbeidsgiver === YesOrNo.YES && arbeidsgiverHarUtbetaltLønn === YesOrNo.YES) ||
        (harHattFraværHosArbeidsgiver === YesOrNo.YES && arbeidsgiverHarUtbetaltLønn === YesOrNo.NO)
    ) {
        return true;
    } else {
        return false;
    }
};

export const stegEnListeAvArbeidsforholdIsValid = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return listeAvArbeidsforhold
        .map((arbeidsforholdFormData: ArbeidsforholdFormData) =>
            arbeidsforholdFormDataPartOneIsValid(arbeidsforholdFormData)
        )
        .reduceRight(evaluatePrevAndCurrent, true);
};

export const stegEnAnnetArbeidsforholdIsValid = (annetArbeidsforhold: ArbeidsforholdFormData): boolean => {
    return arbeidsforholdFormDataPartOneIsValid(annetArbeidsforhold);
};

export const arbeidsforholdIsValid = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    const ansettelsesLengde = arbeidsforhold[ArbeidsforholdFormDataFields.ansettelseslengde];
    const dokumenter = arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter];
    const harPerioderMedFravær = arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær];
    const perioderMedFravær = arbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær];
    const harDagerMedDelvisFravær = arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær];
    const dagerMedDelvisFravær = arbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær];

    if (
        arbeidsforholdFormDataPartOneIsValid(arbeidsforhold) &&
        ansettelsesLengdeIsValid(ansettelsesLengde, dokumenter) &&
        perioderIsValid(harPerioderMedFravær, perioderMedFravær) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, dagerMedDelvisFravær)
    ) {
        return true;
    } else {
        return false;
    }
};

export const listeAvArbeidsforholdIsValid = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    const mapped = listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) =>
        arbeidsforholdIsValid(arbeidsforhold)
    );
    const isValid = mapped.reduceRight(evaluatePrevAndCurrent, true);
    return isValid;
};

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

export const harMinimumEtGjeldendeArbeidsforhold = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return (
        listeAvArbeidsforhold
            .map((arbeidsforhold: ArbeidsforholdFormData) => {
                return skalInkludereArbeidsforhold(arbeidsforhold);
            })
            .filter((skalInkludere: boolean) => {
                return skalInkludere === true;
            }).length > 0
    );
};

const manglerSvar = (arbeidsforhold: ArbeidsforholdFormData): boolean =>
    arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.UNANSWERED ||
    arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.UNANSWERED;

const erGjeldende = (arbeidsforhold: ArbeidsforholdFormData): boolean =>
    arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
    arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO;

export const checkNext = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    if (listeAvArbeidsforhold.length > 0) {
        const [arbeidsforhold, ...rest] = listeAvArbeidsforhold;
        const u: ArbeidsforholdFormData = arbeidsforhold;

        if (!arbeidsforholdFormDataPartOneIsValid(u) || erGjeldende(u)) {
            return false;
        }
        return checkNext(rest);
    }
    return true;
};

export const harIngenGjeldendeArbeidsforholdOgAlleSpørsmålErBesvart = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): boolean => {
    return checkNext(listeAvArbeidsforhold);
};
