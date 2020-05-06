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