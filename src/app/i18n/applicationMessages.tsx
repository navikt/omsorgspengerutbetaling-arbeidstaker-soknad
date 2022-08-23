import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import bostedUtlandMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import fosterbarnMessages from '@navikt/sif-common-forms/lib/fosterbarn/fosterbarnMessages';
import fraværMessages from '@navikt/sif-common-forms/lib/fravær/fraværMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

export const appBokmålstekster = require('./nb.json');
export const appNynorsktekster = require('./nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...fosterbarnMessages.nb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
    ...soknadIntlMessages.nb,
};

const nynorsktekster = {
    ...allCommonMessages.nn,
    ...appNynorsktekster,
    ...fosterbarnMessages.nn,
    ...bostedUtlandMessages.nn,
    ...fraværMessages.nn,
    ...soknadIntlMessages.nn,
};

const getIntlMessages = (): MessageFileFormat => {
    if (isFeatureEnabled(Feature.NYNORSK)) {
        return {
            nb: bokmålstekster,
            nn: nynorsktekster,
        };
    } else {
        return {
            nb: bokmålstekster,
        };
    }
};

export const applicationIntlMessages = getIntlMessages();
