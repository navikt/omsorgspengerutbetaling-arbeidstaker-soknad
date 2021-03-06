import { render, RenderResult } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import IntlProvider from 'app/components/intl-provider/IntlProvider';
import { getStepConfig, StepID } from '../../../config/stepConfig';
import Step from '../Step';

jest.mock('../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {},
    };
});

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <IntlProvider locale="nb" onError={() => null}>
            <MemoryRouter>{child}</MemoryRouter>
        </IntlProvider>
    );

describe('<Step>', () => {
    const stepID: StepID = StepID.SITUASJON;
    let renderResult: RenderResult;

    beforeAll(() => {
        renderResult = renderWrappedInMemoryRouter(
            <Step id={stepID} stepConfig={getStepConfig()}>
                content
            </Step>
        );
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Din situasjon')).toBeTruthy();
    });
});
