import { Severity } from '@sentry/types';
import { isRunningLocally } from './envUtils';
import * as Sentry from '@sentry/browser';
import { AxiosError } from 'axios';
import { isString } from 'formik';

export const logToSentryOrConsole = (message: string, severity: Severity): void => {
    if (isRunningLocally(window.location.hostname)) {
        // tslint:disable-next-line:no-console
        console.warn(`Severity: ${severity}. Message: ${message}`);
    } else {
        Sentry.captureMessage(message, severity);
    }
};

export const logApiCallErrorToSentryOrConsole = (error: AxiosError): void => {
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
    prod = 'prod',
    hostUndefined = 'hostUndefined'
}

export const setSentryEnvironment = (maybeHost: string | undefined): SentryEnvironment => {
    if (maybeHost && isString(maybeHost)) {
        if (maybeHost.indexOf('localhost') > -1) {
            return SentryEnvironment.LOCALHOST;
        }
        if (maybeHost.indexOf('www-q0.nav.no') > -1) {
            return SentryEnvironment.q;
        }
        if (maybeHost.indexOf('www.nav.no') > -1) {
            return SentryEnvironment.prod;
        }
    }
    return SentryEnvironment.hostUndefined;
};

export const setSentryEnvironmentFromHost = (): SentryEnvironment => setSentryEnvironment(window?.location?.host);
