// https://www-q0.nav.no/familie/sykdom-i-familien/soknad/omsorgspengerutbetaling-arbeidstaker/soknad/situasjon


import { StepID } from '../../config/stepConfig';
import { getMaybeSøknadRoute } from '../routeUtils';
import RouteConfig from '../../config/routeConfig';
import { SentryEnvironment, setSentryEnvironment } from '../sentryUtils';

describe('routeUtils', () => {
    it('sentry environment is set correctly', () => {
        expect(setSentryEnvironment('localhost:8080')).toEqual(SentryEnvironment.LOCALHOST);
        expect(setSentryEnvironment('www-q0.nav.no')).toEqual(SentryEnvironment.q);
        expect(setSentryEnvironment('www.nav.no')).toEqual(SentryEnvironment.prod);
        expect(setSentryEnvironment('www.asdf.gh')).toEqual(SentryEnvironment.host_undefined);
    });
});