import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}/${routeConfig.WELCOMING_PAGE_ROUTE}`;

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const navigateToNAVno = () => window.location.assign(navNoUrl);
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToWelcomePage = () => window.location.assign(welcomePageUrl);
export const assignErrorUrl = () => window.location.assign(getRouteUrl(routeConfig.ERROR_PAGE_ROUTE));
