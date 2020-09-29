import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';
import { Locale } from 'common/types/Locale';
import { Søkerdata } from '../../types/Søkerdata';
import { getEnvironmentVariable } from '../../utils/envUtils';
import IntlProvider from '../intl-provider/IntlProvider';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
    children: React.ReactNode;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({
    locale,
    onChangeLocale,
    children,
}: ApplicationWrapperProps) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {isFeatureEnabled(Feature.NYNORSK) && <LanguageToggle locale={locale} toggle={onChangeLocale} />}
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
