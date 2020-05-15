import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { skalInkludereArbeidsforhold } from './arbeidsforholdValidations';

export const perioderIsValid = (harPerioderMedFravær: YesOrNo, perioderMedFravær: Periode[]): boolean =>
    harPerioderMedFravær === YesOrNo.NO || (harPerioderMedFravær === YesOrNo.YES && perioderMedFravær.length > 0);

export const perioderForGjeldendeArbeidsforholdIsValid = (gjeldendeArbeidsforhold: ArbeidsforholdFormData): boolean =>
    gjeldendeArbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær].length > 0 ||
    gjeldendeArbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær].length > 0;

export const delvisFraværIsValid = (
    harDagerMedDelvisFravær: YesOrNo,
    dagerMedDelvisFravær: FraværDelerAvDag[]
): boolean =>
    harDagerMedDelvisFravær === YesOrNo.NO ||
    (harDagerMedDelvisFravær === YesOrNo.YES && dagerMedDelvisFravær.length > 0);

export const harIkkeBesvartAltEnnå = (arbeidsforhold: ArbeidsforholdFormData) => {
    if (
        arbeidsforhold.harPerioderMedFravær === YesOrNo.UNANSWERED ||
        arbeidsforhold.harDagerMedDelvisFravær === YesOrNo.UNANSWERED
    ) {
        return true;
    } else {
        return false;
    }
};

export const arbeidsforholdHarIngenPerioder = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    if (
        arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO
    ) {
        return true;
    } else {
        return false;
    }
};

export const invalidPerioderAfterAllQuestionsAnswered = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    const listeAvGjeldendeArbeidsforhold = listeAvArbeidsforhold.filter((arbeidsforhold: ArbeidsforholdFormData) =>
        skalInkludereArbeidsforhold(arbeidsforhold)
    );
    const ikkeFerdigÅSvare: boolean = listeAvGjeldendeArbeidsforhold.filter((arbeidsforhold: ArbeidsforholdFormData) =>
        harIkkeBesvartAltEnnå(arbeidsforhold)
    ).length > 0;
    if (ikkeFerdigÅSvare) {
        return false;
    }
    const harUgyldige: boolean = listeAvGjeldendeArbeidsforhold.filter((arbeidsforhold: ArbeidsforholdFormData) => {
        return arbeidsforholdHarIngenPerioder(arbeidsforhold);
    }).length > 0;
    if (harUgyldige) {
        return true;
    }
    return false;
};
