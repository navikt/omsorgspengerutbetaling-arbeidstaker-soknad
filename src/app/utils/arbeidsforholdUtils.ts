import { Arbeidsgiver, Søkerdata } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { FormikProps } from 'formik';
import { Arbeidsforhold, ArbeidsforholdField, SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import demoSøkerdata from '../demo/demoData';
import { apiUtils } from './apiUtils';
import { appIsRunningInDemoMode } from './envUtils';
import { YesOrNo } from 'common/types/YesOrNo';

// arbeidsforhold.find((f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer)

export const syndArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    const arbeidsforholdUpdatedList: Arbeidsforhold[] = arbeidsgivere.map((arbeidsgiver: Arbeidsgiver) => {

        const a: Arbeidsforhold | undefined = arbeidsforhold.find((f) => f.organisasjonsnummer === arbeidsgiver.organisasjonsnummer);

        return {
            ...arbeidsgiver,
            [ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn]: a ? a[ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn]: YesOrNo.UNANSWERED,
            [ArbeidsforholdField.harHattFraværHosArbeidsgiver]: a ? a[ArbeidsforholdField.harHattFraværHosArbeidsgiver]: YesOrNo.UNANSWERED
        }
    });
    return arbeidsforholdUpdatedList
};

export const updateArbeidsforhold = (formikProps: FormikProps<SøknadFormData>, arbeidsgivere: Arbeidsgiver[]) => {
    const updatedArbeidsforhold: Arbeidsforhold[] = syndArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[SøknadFormField.arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(SøknadFormField.arbeidsforhold, updatedArbeidsforhold);
    }
};

export type SøknadFormikProps = FormikProps<SøknadFormData> & { submitForm: () => Promise<void> };

export async function getArbeidsgivere(
    fromDate: Date,
    toDate: Date,
    formikProps: SøknadFormikProps,
    søkerdata: Søkerdata
) {
    if (appIsRunningInDemoMode()) {
        søkerdata.setArbeidsgivere(demoSøkerdata.arbeidsgivere);
        updateArbeidsforhold(formikProps, demoSøkerdata.arbeidsgivere);
        return;
    }
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const { organisasjoner } = response.data;
        // søkerdata.setArbeidsgivere(organisasjoner); // TODO: Sjekk hva denne ble brukt til

        updateArbeidsforhold(formikProps, organisasjoner);
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
    }
}
