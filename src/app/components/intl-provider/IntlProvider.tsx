import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import fraværMessages from '@navikt/sif-common-forms/lib/fravær/fraværMessages';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';
import fosterbarnMessages from '@navikt/sif-common-forms/lib/fosterbarn/fosterbarnMessages';

const selvstendigMessagesNb = require('../../i18n/selvstendigOgFrilans.nb.json');

const appBokmålstekster = require('../../i18n/nb.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...fosterbarnMessages.nb,
    ...selvstendigMessagesNb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
};

export interface IntlProviderProps {
    locale: Locale;
}

export interface IntlProviderProps {
    children: React.ReactNode;
    locale: Locale;
    onError?: (err: any) => void;
}

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children, onError }: IntlProviderProps) => {
    return (
        <Provider locale={locale} messages={bokmålstekster} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
