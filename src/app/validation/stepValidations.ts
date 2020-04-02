import { YesOrNo } from 'common/types/YesOrNo';
import {
    Arbeidsforhold,
    ArbeidsforholdField,
    HvorforSøkerDuDirekte,
    HvorforSøkerDuDirekteSubFields,
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
import { SituasjonStepQuestions } from '../søknad/situasjon-step/config';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData): boolean =>
    harForståttRettigheterOgPlikter === true;

export const begrunnelseStepIsValid = (formData: SøknadFormData): boolean => {
    const { hvorforSøkerDuDirekte, hvorforSøkerDuDirekteSubfields } = formData;

    return (
        hvorforSøkerDuDirekte !== HvorforSøkerDuDirekte.ikkeBesvart &&
        (hvorforSøkerDuDirekte !== HvorforSøkerDuDirekte.mindreEnnFireUker ||
            hvorforSøkerDuDirekteSubfields !== HvorforSøkerDuDirekteSubFields.ikkeBesvart)
    );
};

export const situasjonStepIsValid = (formData: SøknadFormData): boolean => {
    const listeAvArbeidsforhold: Arbeidsforhold[] = formData[SøknadFormField.arbeidsforhold];
    const arbeidsforholdStepIsValid: boolean =
        listeAvArbeidsforhold
            .map((arbeidsforhold: Arbeidsforhold) => {
                return (
                    arbeidsforhold[ArbeidsforholdField.harHattFraværHosArbeidsgiver] !== YesOrNo.UNANSWERED &&
                    (arbeidsforhold[ArbeidsforholdField.harHattFraværHosArbeidsgiver] !== YesOrNo.YES ||
                        arbeidsforhold[ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn] !== YesOrNo.UNANSWERED)
                );
            })
            .filter((bool: boolean) => bool === false).length === 0;

    return SituasjonStepQuestions.getVisbility(formData).areAllQuestionsAnswered() && arbeidsforholdStepIsValid;
};

export const periodeStepIsValid = (formData: SøknadFormData): boolean => {
    const harPerioderMedFravær: YesOrNo = formData[SøknadFormField.harPerioderMedFravær];
    const perioderMedFravær: Periode[] = formData[SøknadFormField.perioderMedFravær];
    const harDagerMedDelvisFravær: YesOrNo = formData[SøknadFormField.harDagerMedDelvisFravær];
    const dagerMedDelvisFravær: FraværDelerAvDag[] = formData[SøknadFormField.dagerMedDelvisFravær];
    const perioderHarVærtIUtlandet: YesOrNo = formData[SøknadFormField.perioder_harVærtIUtlandet];
    const perioderUtenlandsopphold: Utenlandsopphold[] = formData[SøknadFormField.perioder_utenlandsopphold];

    const isValid: boolean = !!(
        perioderIsValid(harPerioderMedFravær, perioderMedFravær) &&
        delvisFraværIsValid(harDagerMedDelvisFravær, dagerMedDelvisFravær) &&
        oppholdIsValid(perioderHarVærtIUtlandet, perioderUtenlandsopphold) &&
        minimumEnUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær)
    );
    return isValid;
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: SøknadFormData): boolean =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
