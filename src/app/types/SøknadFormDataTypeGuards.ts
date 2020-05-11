import { SøknadFormData, SøknadFormField } from './SøknadFormData';

export const isSøknadFormData = (søknadFormData: any): søknadFormData is SøknadFormData => {
    if (
        søknadFormData &&
        søknadFormData[SøknadFormField.harForståttRettigheterOgPlikter] !== undefined &&
        søknadFormData[SøknadFormField.harBekreftetOpplysninger] !== undefined &&
        søknadFormData[SøknadFormField.arbeidsforhold] &&
        søknadFormData[SøknadFormField.annetArbeidsforhold] &&
        søknadFormData[SøknadFormField.harFosterbarn] &&
        søknadFormData[SøknadFormField.fosterbarn] &&
        søknadFormData[SøknadFormField.perioderHarVærtIUtlandet] &&
        søknadFormData[SøknadFormField.perioderUtenlandsopphold] &&
        søknadFormData[SøknadFormField.harSøktAndreUtbetalinger] &&
        søknadFormData[SøknadFormField.andreUtbetalinger] &&
        søknadFormData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] &&
        søknadFormData[SøknadFormField.utenlandsoppholdSiste12Mnd] &&
        søknadFormData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] &&
        søknadFormData[SøknadFormField.utenlandsoppholdNeste12Mnd]
    ) {
        return true;
    }
    return false;
};
