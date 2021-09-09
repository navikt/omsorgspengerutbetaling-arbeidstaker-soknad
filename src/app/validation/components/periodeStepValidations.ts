import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from 'app/types/ArbeidsforholdTypes';

export const perioderIsValid = ({ harPerioderMedFravær, fraværPerioder }: ArbeidsforholdFormData): boolean =>
    harPerioderMedFravær === YesOrNo.NO || (harPerioderMedFravær === YesOrNo.YES && fraværPerioder.length > 0);

export const delvisFraværIsValid = ({ harDagerMedDelvisFravær, fraværDager }: ArbeidsforholdFormData): boolean =>
    harDagerMedDelvisFravær === YesOrNo.NO || (harDagerMedDelvisFravær === YesOrNo.YES && fraværDager.length > 0);
