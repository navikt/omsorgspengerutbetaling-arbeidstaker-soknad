import { Severity } from '@sentry/types';
import { isRunningLocally } from './envUtils';
import * as Sentry from '@sentry/browser';
import { AxiosError } from 'axios';

export const logToSentryOrConsole = (message: string, severity: Severity) => {
    if (isRunningLocally(window.location.hostname)) {
        // tslint:disable-next-line:no-console
        console.warn(`Severity: ${severity}. Message: ${message}`);
    } else {
        Sentry.captureMessage(message, severity)
    }
};

export const logApiCallErrorToSentryOrConsole = (error: AxiosError) => {
    const maybeXRequestId: string | undefined = error?.response?.headers['x-request-id'];
    Sentry.withScope((scope) => {
        scope.setExtras({
            XRequestId: maybeXRequestId || undefined,
            error
        });
        logToSentryOrConsole('Api call error', Severity.Critical);
    });
};

export enum SentryEnvironment {
    LOCALHOST = 'LOCALHOST',
    q = 'q',
    prod = 'prod'
}

export const setSentryEnvironment = (): SentryEnvironment => {
    const host: string = window?.location?.host;
    if (host.indexOf('localhost')) {
        return SentryEnvironment.LOCALHOST;
    }
    if (host.indexOf('www-q0.nav.no')) {
        return SentryEnvironment.q;
    }
    return SentryEnvironment.prod;
};