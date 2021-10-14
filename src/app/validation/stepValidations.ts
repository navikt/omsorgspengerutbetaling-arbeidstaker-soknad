import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    harMinimumEtGjeldendeArbeidsforhold,
    listeAvArbeidsforholdIsValid,
    skalInkludereArbeidsforhold,
    stegEnListeAvArbeidsforholdIsValid,
} from './components/arbeidsforholdValidations';
import { utenlandsoppholdFormIsValid } from './components/utenlandsoppholdValidations';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = ({ arbeidsforhold }: SøknadFormData): boolean =>
    harMinimumEtGjeldendeArbeidsforhold([...arbeidsforhold]) && stegEnListeAvArbeidsforholdIsValid(arbeidsforhold);

export const fraværStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvGjeldende = [...formData[SøknadFormField.arbeidsforhold]].filter(
        (arbeidsforhold: ArbeidsforholdFormData) => {
            return skalInkludereArbeidsforhold(arbeidsforhold);
        }
    );

    return listeAvArbeidsforholdIsValid(listeAvGjeldende) && utenlandsoppholdFormIsValid(formData);
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
