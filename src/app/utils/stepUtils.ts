import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { SøknadFormData } from '../types/SøknadFormData';

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

export const situasjonStepIsAvailable = (formData: SøknadFormData) => true;
// welcomingPageIsValid(formData);

export const egenutbetalingStepIsAvailable = (formData: SøknadFormData) => true;
// situasjonStepIsAvailable(formData) && situasjonStepIsValid(formData);

export const periodeStepIsAvailable = (formData: SøknadFormData) => true;
// egenutbetalingStepIsAvailable(formData) && egenutbetalingIsValid(formData);

export const legeerklæringStepAvailable = (formData: SøknadFormData) => true;
// periodeStepIsValid(formData);

export const inntektStepIsAvailable = (formData: SøknadFormData) => true;
// periodeStepIsAvailable(formData) && periodeStepIsValid(formData);

export const medlemskapStepIsAvailable = (formData: SøknadFormData) => true;
// periodeStepIsAvailable(formData) && periodeStepIsValid(formData);
// inntektStepIsAvailable(formData) && inntektStepIsValid(formData);

export const summaryStepAvailable = (formData: SøknadFormData) => true;
// medlemskapStepIsValid(formData);
