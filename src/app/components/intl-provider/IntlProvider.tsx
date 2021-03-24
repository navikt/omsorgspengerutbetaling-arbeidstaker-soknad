import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import fraværMessages from '@navikt/sif-common-forms/lib/fravær/fraværMessages';
import fosterbarnMessages from '@navikt/sif-common-forms/lib/fosterbarn/fosterbarnMessages';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';
import dayjs from 'dayjs';
require('dayjs/locale/nb');
require('dayjs/locale/nn');

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...fosterbarnMessages.nb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
};

const nynorsktekster = {
    ...allCommonMessages.nn,
    ...appNynorsktekster,
    ...fosterbarnMessages.nn,
    ...bostedUtlandMessages.nn,
    ...fraværMessages.nn,
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
    dayjs.locale(locale === 'nb' ? 'nb' : 'nn');
    return (
        <Provider locale={locale} messages={locale === 'nb' ? bokmålstekster : nynorsktekster} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
