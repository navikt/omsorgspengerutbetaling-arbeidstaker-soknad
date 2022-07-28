import { SøknadFormData } from '../types/SøknadFormData';
import {
    medlemskapStepIsValid,
    fraværStepIsValid,
    situasjonStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';

export const situasjonStepIsAvailable = (formData: SøknadFormData): boolean => welcomingPageIsValid(formData);

export const fraværStepIsAvailable = (formData: SøknadFormData): boolean =>
    situasjonStepIsAvailable(formData) && situasjonStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData): boolean =>
    fraværStepIsAvailable(formData) && fraværStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData): boolean =>
    medlemskapStepIsAvailable(formData) && medlemskapStepIsValid(formData);
