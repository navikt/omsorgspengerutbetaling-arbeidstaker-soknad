import { Severity } from '@sentry/types';
import { isRunningLocally } from './envUtils';
import * as Sentry from '@sentry/browser';

export const logToSentryOrConsole = (message: string, severity: Severity) => {
    if (isRunningLocally(window.location.hostname)) {
        // tslint:disable-next-line:no-console
        console.warn(`Severity: ${severity}. Message: ${message}`);
    } else {
        Sentry.captureMessage(message, severity)
    }
};