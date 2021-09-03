import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    Utbetalingsårsak,
} from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import { delvisFraværIsValid, perioderIsValid } from './periodeStepValidations';
import { evaluatePrevAndCurrent } from '../validationUtils';

export const skalInkludereArbeidsforhold = (arbeidsforholdFormData: ArbeidsforholdFormData): boolean =>
    !!(
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO
    );

export const arbeidsforholdFormDataPartOneIsValid = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    const harHattFraværHosArbeidsgiver: YesOrNo =
        arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver];
    const arbeidsgiverHarUtbetaltLønn: YesOrNo =
        arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn];
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

const validatekonfliktForklaring = (konfliktForklaring?: string): boolean => {
    return konfliktForklaring &&
        typeof konfliktForklaring === 'string' &&
        konfliktForklaring.length > 0 &&
        konfliktForklaring.length < 2000
        ? true
        : false;
};

export const utbetalingsårsakIsValid = (konfliktForklaring?: string, utbetalingsårsak?: Utbetalingsårsak): boolean => {
    if (utbetalingsårsak) {
        return utbetalingsårsak === Utbetalingsårsak.nyoppstartetHosArbeidsgiver ||
            utbetalingsårsak === Utbetalingsårsak.arbeidsgiverKonkurs
            ? true
            : utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver &&
              validatekonfliktForklaring(konfliktForklaring)
            ? true
            : false;
    } else return false;
};
export const stegEnListeAvArbeidsforholdIsValid = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return listeAvArbeidsforhold
        .map((arbeidsforholdFormData: ArbeidsforholdFormData) =>
            arbeidsforholdFormDataPartOneIsValid(arbeidsforholdFormData)
        )
        .reduceRight(evaluatePrevAndCurrent, true);
};

export const arbeidsforholdIsValid = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    const utbetalingsårsak = arbeidsforhold.utbetalingsårsak;
    const konfliktForklaring = arbeidsforhold.konfliktForklaring;
    const harPerioderMedFravær = arbeidsforhold.harPerioderMedFravær;
    const fraværPerioder = arbeidsforhold.fraværPerioder;
    const harDagerMedDelvisFravær = arbeidsforhold.harDagerMedDelvisFravær;
    const fraværDager = arbeidsforhold.fraværDager;

    if (
        arbeidsforholdFormDataPartOneIsValid(arbeidsforhold) &&
        utbetalingsårsakIsValid(konfliktForklaring, utbetalingsårsak) &&
        perioderIsValid(harPerioderMedFravær, fraværPerioder) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, fraværDager)
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

export const harMinimumEtGjeldendeArbeidsforhold = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return (
        listeAvArbeidsforhold
            .map((arbeidsforhold: ArbeidsforholdFormData) => {
                return skalInkludereArbeidsforhold(arbeidsforhold);
            })
            .filter((skalInkludere: boolean) => skalInkludere).length > 0
    );
};

const checkAlleArbeidsforhold = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[],
    verificationFunction: (arbeidsforhold: ArbeidsforholdFormData) => boolean
): boolean => {
    if (listeAvArbeidsforhold.length === 0) {
        return true;
    }
    return listeAvArbeidsforhold.map(verificationFunction).filter((value) => !value).length <= 0;
};

const erJaJaCombo = (arbeidsforhold: ArbeidsforholdFormData): boolean =>
    arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
    arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES;

export const erNeiCombo = (arbeidsforhold: ArbeidsforholdFormData): boolean =>
    !!(arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.NO);

const erJaEllerNeiNeiCombo = (arbeidsforhold: ArbeidsforholdFormData): boolean =>
    erJaJaCombo(arbeidsforhold) || erNeiCombo(arbeidsforhold);

export const checkHarKlikketJaJaPåAlle = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return checkAlleArbeidsforhold(listeAvArbeidsforhold, erJaJaCombo);
};

export const checkHarKlikketNeiPåAlle = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return checkAlleArbeidsforhold(listeAvArbeidsforhold, erNeiCombo);
};

export const checkHarKlikketNeiElleJajaBlanding = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return (
        checkAlleArbeidsforhold(listeAvArbeidsforhold, erJaEllerNeiNeiCombo) &&
        !checkAlleArbeidsforhold(listeAvArbeidsforhold, erJaJaCombo) &&
        !checkAlleArbeidsforhold(listeAvArbeidsforhold, erNeiCombo)
    );
};
