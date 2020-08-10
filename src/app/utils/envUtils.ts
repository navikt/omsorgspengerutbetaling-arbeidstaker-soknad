export const getEnvironmentVariable = (variableName: string): string => (window as any).appSettings[variableName];

export const isRunningLocally = (hostname: string): boolean => hostname.includes('localhost');
