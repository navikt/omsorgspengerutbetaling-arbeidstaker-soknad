import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import {
    harMinimumEtGjeldendeArbeidsforhold,
    listeAvArbeidsforholdIsValid, skalInkludereArbeidsforhold,
    stegEnAnnetArbeidsforholdIsValid,
    stegEnListeAvArbeidsforholdIsValid
} from './components/arbeidsforholdValidations';
import { harFosterbarnOgListeAvFosterbarnIsValid } from './components/fosterbarnValidations';
import { utenlandsoppholdFormIsValid } from './components/utenlandsoppholdValidations';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { AndreUtbetalinger } from '../types/AndreUtbetalinger';
import { andreUtbetalingerFormIsValid } from './components/andreUtbetalingerValidations';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = formData[SøknadFormField.annetArbeidsforhold];
    const harFosterbarn = formData[SøknadFormField.harFosterbarn];
    const listeAvFosterbarn = formData[SøknadFormField.fosterbarn];

    if (
        harMinimumEtGjeldendeArbeidsforhold([...listeAvArbeidsforhold, annetArbeidsforhold]) &&
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
    const listeAvGjeldende = [...listeAvArbeidsforhold, annetArbeidsforhold].filter((arbeidsforhold: ArbeidsforholdFormData) => {
        return skalInkludereArbeidsforhold(arbeidsforhold);
    });
    return listeAvArbeidsforholdIsValid(listeAvGjeldende);
};

export const annetStepIsValid = (formData: SøknadFormData): boolean => {
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioderHarVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioderUtenlandsopphold];

    const harSøknadAndreUtbetalinger: YesOrNo = formData[SøknadFormField.harSøktAndreUtbetalinger];
    const andreUtbetalinger: AndreUtbetalinger[] = formData[SøknadFormField.andreUtbetalinger];

    if (
        utenlandsoppholdFormIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        andreUtbetalingerFormIsValid(harSøknadAndreUtbetalinger, andreUtbetalinger)
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
