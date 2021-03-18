import { SøknadFormData } from './SøknadFormData';

export const isSøknadFormData = (søknadFormData: any): søknadFormData is SøknadFormData => {
    if (
        søknadFormData &&
        søknadFormData.harForståttRettigheterOgPlikter !== undefined &&
        søknadFormData.harBekreftetOpplysninger !== undefined &&
        søknadFormData.arbeidsforhold &&
        søknadFormData.annetArbeidsforhold &&
        søknadFormData.perioderHarVærtIUtlandet &&
        søknadFormData.perioderUtenlandsopphold &&
        søknadFormData.harSøktAndreUtbetalinger &&
        søknadFormData.andreUtbetalinger &&
        søknadFormData.erSelvstendigOgEllerFrilans &&
        søknadFormData.selvstendigOgEllerFrilans &&
        søknadFormData.harBoddUtenforNorgeSiste12Mnd &&
        søknadFormData.utenlandsoppholdSiste12Mnd &&
        søknadFormData.skalBoUtenforNorgeNeste12Mnd &&
        søknadFormData.utenlandsoppholdNeste12Mnd
    ) {
        return true;
    }
    return false;
};
