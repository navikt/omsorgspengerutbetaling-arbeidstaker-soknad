import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const getEnvironmentVariable = (variableName: string): string => (window as any).appSettings[variableName];

export const appIsRunningInDemoMode = (): boolean => isFeatureEnabled(Feature.DEMO_MODE);

export const isRunningLocally = (hostname: string): boolean => hostname.includes('localhost');
