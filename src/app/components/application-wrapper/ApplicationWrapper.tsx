import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationMessages from '@navikt/sif-common-core/lib/dev-utils/intl/application-messages/ApplicationMessages';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';
import { Locale } from 'common/types/Locale';
import { Søkerdata } from '../../types/Søkerdata';
import { getEnvironmentVariable } from '../../utils/envUtils';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import IntlProvider, { appBokmålstekster, appNynorsktekster } from '../intl-provider/IntlProvider';

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
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>
                    {children}
                    <ApplicationMessages
                        messages={{
                            nb: appBokmålstekster,
                            nn: appNynorsktekster,
                        }}
                        title="Søknad pleiepenger"
                    />
                </Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
