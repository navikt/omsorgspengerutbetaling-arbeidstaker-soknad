const process = require('process');
require('dotenv').config();

const envSettings = () => {
    const API_URL = process.env.API_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const LOGIN_URL = process.env.LOGIN_URL;
    const TOGGLE_LANGUAGE = process.env.TOGGLE_LANGUAGE;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const STENGT_BHG_SKOLE = process.env.STENGT_BHG_SKOLE;
    const NYNORSK = process.env.NYNORSK;
    const MELLOMLAGRING = process.env.MELLOMLAGRING;
    const APPSTATUS_PROJECT_ID = process.env.APPSTATUS_PROJECT_ID;
    const APPSTATUS_DATASET = process.env.APPSTATUS_DATASET;

    const appSettings = `
     window.appSettings = {
         API_URL: '${API_URL}',
         PUBLIC_PATH: '${PUBLIC_PATH}',
         LOGIN_URL: '${LOGIN_URL}',
         TOGGLE_LANGUAGE: '${TOGGLE_LANGUAGE}',
         UTILGJENGELIG: '${UTILGJENGELIG}',
         STENGT_BHG_SKOLE: '${STENGT_BHG_SKOLE}',
         NYNORSK: '${NYNORSK}',
         MELLOMLAGRING: '${MELLOMLAGRING}',
         APPSTATUS_PROJECT_ID: '${APPSTATUS_PROJECT_ID}',
         APPSTATUS_DATASET: '${APPSTATUS_DATASET}'
     };`
        .trim()
        .replace(/ /g, '');

    try {
        return appSettings;
    } catch (e) {
        console.error(e);
    }
};

module.exports = envSettings;