import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik/lib';
import { History } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import BackLink from 'common/components/back-link/BackLink';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemHelper from 'common/utils/bemUtils';
import { getStepTexts } from 'app/utils/stepUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../../config/stepConfig';
import StepIndicator from '../step-indicator/StepIndicator';
import './step.less';

const bem = bemHelper('step');

export interface StepProps {
    id: StepID;
    useValidationErrorSummary?: boolean;
}

interface OwnProps {
    children: React.ReactNode;
    stepConfig: StepConfigInterface;
}

type Props = StepProps & OwnProps;
const Step: React.FunctionComponent<Props> = ({ id, stepConfig, useValidationErrorSummary, children }: Props) => {
    const intl = useIntl();
    const conf = stepConfig[id];
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);
    return (
        <Page
            className={bem.block}
            title={stepTexts.pageTitle}
            topContentRenderer={(): JSX.Element => (
                <>
                    <StepBanner text={intlHelper(intl, 'banner.title')} />
                    {useValidationErrorSummary !== false && <FormikValidationErrorSummary />}
                </>
            )}>
            <BackLink
                href={conf.backLinkHref}
                className={bem.element('backLink')}
                onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                    event.preventDefault();
                    history.push(nextHref);
                }}
            />
            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xxl">
                <Systemtittel tag="h1" className={bem.element('title')}>
                    {stepTexts.stepTitle}
                </Systemtittel>
            </Box>
            <Box margin="xl">{children}</Box>
        </Page>
    );
};

export default Step;
