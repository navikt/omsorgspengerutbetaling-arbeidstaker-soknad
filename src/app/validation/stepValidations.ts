import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    harMinimumEtGjeldendeArbeidsforhold,
    listeAvArbeidsforholdIsValid,
    skalInkludereArbeidsforhold,
    stegEnListeAvArbeidsforholdIsValid,
} from './components/arbeidsforholdValidations';
import { utenlandsoppholdFormIsValid } from './components/utenlandsoppholdValidations';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];

    if (
        harMinimumEtGjeldendeArbeidsforhold([...listeAvArbeidsforhold]) &&
        stegEnListeAvArbeidsforholdIsValid(listeAvArbeidsforhold)
    ) {
        return true;
    } else {
        return false;
    }
};

export const periodeStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];
    const listeAvGjeldende = [...listeAvArbeidsforhold].filter((arbeidsforhold: ArbeidsforholdFormData) => {
        return skalInkludereArbeidsforhold(arbeidsforhold);
    });
    return listeAvArbeidsforholdIsValid(listeAvGjeldende);
};

export const annetStepIsValid = (formData: SøknadFormData): boolean => {
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioderHarVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioderUtenlandsopphold];

    if (utenlandsoppholdFormIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold)) {
        return true;
    } else {
        return false;
    }
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
