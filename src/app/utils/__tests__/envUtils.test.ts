import { getEnvironmentVariable, isRunningLocally } from '../envUtils';

describe('envUtils', () => {
    describe('getEnvironmentVariable', () => {
        it('should get environment variables from window.appSettings object from provided property name', () => {
            (window as any).appSettings = { someEnvVar: 1, someOtherEnvVar: 2 };
            expect(getEnvironmentVariable('someEnvVar')).toBe(1);
            expect(getEnvironmentVariable('someOtherEnvVar')).toBe(2);
        });
    });

    describe('isLocalhost', () => {
        it('should determine if it is localhost or not', () => {
            expect(isRunningLocally('localhost:8080/masse/greier/bak/her')).toBe(true);
            expect(isRunningLocally('https://www.nav.no/et/eller/annet')).toBe(false);
            expect(isRunningLocally('omsorgspenger.nav.no/et/eller/annet')).toBe(false);
            expect(isRunningLocally('omsorgspenger-q.nav.no/et/eller/annet')).toBe(false);
            expect(isRunningLocally('www-q0.nav.no/et/eller/annet')).toBe(false);
        });
    });
});
