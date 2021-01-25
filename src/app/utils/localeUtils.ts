import { Locale } from 'common/types/Locale';

const LocaleSessionKey = 'selectedLocale';

export const getLocaleFromSessionStorage = (): Locale => {
    return (sessionStorage.getItem(LocaleSessionKey) as Locale) || 'nb';
};

export const setLocaleInSessionStorage = (locale: Locale) => {
    sessionStorage.setItem(LocaleSessionKey, locale);
};
