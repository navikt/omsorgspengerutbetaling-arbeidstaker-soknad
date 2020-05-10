import { YesOrNo } from 'common/types/YesOrNo';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { stegEnAnnetArbeidsforholdIsValid, stegEnArbeidsforholdValid } from './components/arbeidsforholdValidations';
import { fosterbarnIsValid } from './components/fosterbarnValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;


export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {

    const listeAvArbeidsforhold = formData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = formData[SøknadFormField.annetArbeidsforhold];
    const harFosterbarn = formData[SøknadFormField.harFosterbarn];
    const listeAvFosterbarn = formData[SøknadFormField.fosterbarn];

    if (
        stegEnArbeidsforholdValid(listeAvArbeidsforhold) &&
        stegEnAnnetArbeidsforholdIsValid(annetArbeidsforhold) &&
        fosterbarnIsValid(harFosterbarn, listeAvFosterbarn)
    ) {
        return true;
    } else {
        return false;
    }
};

export const periodeStepIsValid = (formData: SøknadFormData): boolean => true // TODO: Fix validation
// export const periodeStepIsValid = (formData: SøknadFormData): boolean => {
//     const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
//     const perioderMedFravær: Periode[] = formData[SøknadFormField.perioderMedFravær];
//     const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
//     const dagerMedDelvisFravær: FraværDelerAvDag[] = formData[SøknadFormField.dagerMedDelvisFravær];
//     const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
//     const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];
//
//     const isValid: boolean = !!(
//         perioderIsValid(harPerioderMedFravær, perioderMedFravær) &&
//         delvisFraværIsValid(harDagerMedDelvisFravær, dagerMedDelvisFravær) &&
//         oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
//         minimumEnUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær)
//     );
//     return isValid;
// };

export const annetStepIsValid = (formData: SøknadFormData): boolean => true; // TODO: Implementer

export const medlemskapStepIsValid = ({
                                          harBoddUtenforNorgeSiste12Mnd,
                                          skalBoUtenforNorgeNeste12Mnd
                                      }: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
