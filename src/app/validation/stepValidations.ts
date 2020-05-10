import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    listeAvArbeidsforholdIsValid,
    stegEnAnnetArbeidsforholdIsValid,
    stegEnListeAvArbeidsforholdIsValid
} from './components/arbeidsforholdValidations';
import { harFosterbarnOgListeAvFosterbarnIsValid } from './components/fosterbarnValidations';
import { utenlandsoppholdIsValid } from './components/utenlandsoppholdValidations';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { AndreUtbetalinger } from '../types/AndreUtbetalinger';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = formData[SøknadFormField.annetArbeidsforhold];
    const harFosterbarn = formData[SøknadFormField.harFosterbarn];
    const listeAvFosterbarn = formData[SøknadFormField.fosterbarn];

    if (
        stegEnListeAvArbeidsforholdIsValid(listeAvArbeidsforhold) &&
        stegEnAnnetArbeidsforholdIsValid(annetArbeidsforhold) &&
        harFosterbarnOgListeAvFosterbarnIsValid(harFosterbarn, listeAvFosterbarn)
    ) {
        return true;
    } else {
        return false;
    }
};

export const periodeStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = formData[SøknadFormField.annetArbeidsforhold];
    return listeAvArbeidsforholdIsValid([...listeAvArbeidsforhold, annetArbeidsforhold]);
};

export const annetStepIsValid = (formData: SøknadFormData): boolean => {
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioderHarVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioderUtenlandsopphold];

    const harSøknadAndreUtbetalinger: YesOrNo = formData[SøknadFormField.harSøktAndreUtbetalinger];
    const andreUtbetalinger: AndreUtbetalinger[] = formData[SøknadFormField.andreUtbetalinger];

    if (
        utenlandsoppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold)
        // TODO && andreUtbetalingerIsValid(harSøknadAndreUtbetalinger, andreUtbetalinger)
    ) {
        return true;
    } else {
        return false;
    }

};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
