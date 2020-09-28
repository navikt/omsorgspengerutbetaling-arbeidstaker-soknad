import getSentryLoggerForApp from '@navikt/sif-common-sentry';

const appSentryLogger = getSentryLoggerForApp('omsorgspengerutbetaling-arbeidstaker-soknad', ['sykdom-i-familien']);

export default appSentryLogger;
