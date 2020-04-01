import { Arbeidsgiver, Søkerdata } from 'app/types/Søkerdata';
import { YesOrNo } from 'common/types/YesOrNo';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { FormikProps } from 'formik';
import { Arbeidsforhold, SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import demoSøkerdata from '../demo/demoData';
import { apiUtils } from './apiUtils';
import { appIsRunningInDemoMode } from './envUtils';

const roundWithTwoDecimals = (nbr: number): number => Math.round(nbr * 100) / 100;

export const calcRedusertProsentFromRedusertTimer = (timerNormalt: number, timerRedusert: number): number => {
    return roundWithTwoDecimals((100 / timerNormalt) * timerRedusert);
};

export const calcReduserteTimerFromRedusertProsent = (timerNormalt: number, prosentRedusert: number): number => {
    return roundWithTwoDecimals((timerNormalt / 100) * prosentRedusert);
};

export const syndArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    return arbeidsgivere.map((organisasjon) => ({
        ...organisasjon,
        ...arbeidsforhold.find((f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer)
    }));
};

export const getAktiveArbeidsforholdIPerioden = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.filter((a) => a.erAnsattIPerioden === YesOrNo.YES);
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
