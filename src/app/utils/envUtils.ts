import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];

export const appIsRunningInDemoMode = () => isFeatureEnabled(Feature.DEMO_MODE);

