import { YesOrNo } from 'common/types/YesOrNo';
import {
    ArbeidsforholdFormData,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    SøknadFormData,
    SøknadFormField
} from '../types/SøknadFormData';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import {
    delvisFraværIsValid,
    minimumEnUtbetalingsperiode,
    oppholdIsValid,
    perioderIsValid
} from '../søknad/periode-step/periodeStepConfig';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;


export const situasjonStepIsValid = (formData: SøknadFormData): boolean => true; // TODO: Fix validation
// export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {
//     const listeAvArbeidsforhold: ArbeidsforholdFormData[] = formData[SøknadFormField.arbeidsforhold];
//     const arbeidsforholdStepIsValid: boolean =
//         listeAvArbeidsforhold
//             .map((arbeidsforhold: ArbeidsforholdFormData) => {
//                 return (
//                     arbeidsforhold.harHattFraværHosArbeidsgiver !== YesOrNo.UNANSWERED &&
//                     (arbeidsforhold.harHattFraværHosArbeidsgiver !== YesOrNo.YES ||
//                         arbeidsforhold.arbeidsgiverHarUtbetaltLønn !== YesOrNo.UNANSWERED) // TODO: Fix, pga endret type
//                 );
//             })
//             .filter((bool: boolean) => bool === false).length === 0;
//
//     return SituasjonStepQuestions.getVisbility(formData).areAllQuestionsAnswered() && arbeidsforholdStepIsValid;
// };

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
