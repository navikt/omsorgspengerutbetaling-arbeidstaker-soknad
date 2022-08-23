import { getEnvironmentVariable } from '../utils/envUtils';

enum RouteConfig {
    UTILGJENGELIG_ROUTE = '/utilgjengelig',
    SØKNAD_ROUTE_PREFIX = '/soknad',
    WELCOMING_PAGE_ROUTE = '/soknad/velkommen',
    SØKNAD_SENDT_ROUTE = '/soknad/soknad-sendt',
    ERROR_PAGE_ROUTE = '/soknad/feil',
}

export const getRouteUrl = (route: RouteConfig): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export default RouteConfig;
