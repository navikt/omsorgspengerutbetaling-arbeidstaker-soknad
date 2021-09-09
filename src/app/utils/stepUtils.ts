import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    annetStepIsValid,
    medlemskapStepIsValid,
    periodeStepIsValid,
    situasjonStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
    };
};

export const situasjonStepIsAvailable = (formData: SøknadFormData): boolean => welcomingPageIsValid(formData);

export const fraværStepIsAvailable = (formData: SøknadFormData): boolean =>
    situasjonStepIsAvailable(formData) && situasjonStepIsValid(formData);

export const annetStepIsAvailable = (formData: SøknadFormData): boolean =>
    fraværStepIsAvailable(formData) && periodeStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData): boolean =>
    annetStepIsAvailable(formData) && annetStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData): boolean =>
    medlemskapStepIsAvailable(formData) && medlemskapStepIsValid(formData);
