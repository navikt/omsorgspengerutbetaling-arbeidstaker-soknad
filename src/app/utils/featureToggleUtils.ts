export enum Feature {
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'MELLOMLAGRING' = 'MELLOMLAGRING',
}

export const isFeatureEnabled = (feature: Feature): boolean => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
