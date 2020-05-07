import { SøknadFormData, SøknadFormField } from './SøknadFormData';

export const isSøknadFormData = (søknadFormData: any): søknadFormData is SøknadFormData => {
    if (
        søknadFormData &&
        søknadFormData[SøknadFormField.harForståttRettigheterOgPlikter] !== undefined
    // TODO: Må gjøres mer grundig
    ) {
        return true;
    }
    return false;
};