import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    begrunnelseStepIsValid,
    medlemskapStepIsValid,
    periodeStepIsValid,
    situasjonStepIsValid, welcomingPageIsValid
} from '../validation/stepValidations';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
        nextButtonAriaLabel: conf.nextButtonAriaLabel ? intlHelper(intl, conf.nextButtonAriaLabel) : undefined
    };
};

export const begrunnelseStepIsAvailable = (formData: SøknadFormData) => welcomingPageIsValid(formData);

export const situasjonStepIsAvailable = (formData: SøknadFormData) =>
    begrunnelseStepIsAvailable(formData) && begrunnelseStepIsValid(formData);

export const periodeStepIsAvailable = (formData: SøknadFormData) =>
    situasjonStepIsAvailable(formData) && situasjonStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) =>
    periodeStepIsAvailable(formData) && periodeStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) =>
    medlemskapStepIsAvailable(formData) && medlemskapStepIsValid(formData);
