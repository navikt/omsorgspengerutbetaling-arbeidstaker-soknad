import * as React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { getStepTexts } from 'app/utils/stepUtils';
import { StepConfigInterface, StepID } from '../../config/stepConfig';

interface StepIndicatorProps {
    activeStep: number;
    stepConfig: StepConfigInterface;
}

const renderSteps = (stepConfig: StepConfigInterface, intl: IntlShape): JSX.Element[] =>
    Object.keys(stepConfig).map((stepId) => {
        const { stepIndicatorLabel } = getStepTexts(intl, stepId as StepID, stepConfig);
        const { index } = stepConfig[stepId];
        return <Step label={stepIndicatorLabel} index={index} key={`${stepIndicatorLabel + index}`} />;
    });

const StepIndicator: React.FunctionComponent<StepIndicatorProps> = ({ activeStep, stepConfig }: StepIndicatorProps) => {
    const intl = useIntl();
    return (
        <NAVStepIndicator visLabel={false} autoResponsiv={false} aktivtSteg={activeStep}>
            {renderSteps(stepConfig, intl)}
        </NAVStepIndicator>
    );
};

export default StepIndicator;
