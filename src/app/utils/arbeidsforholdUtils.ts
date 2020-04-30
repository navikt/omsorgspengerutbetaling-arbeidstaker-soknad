import { Arbeidsgiver, ArbeidsgiverResponse } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { FormikProps } from 'formik';
import { Arbeidsforhold, ArbeidsforholdField, SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { apiUtils } from './apiUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';

export const syncArbeidsforholdWithArbeidsgivere = (
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
    const updatedArbeidsforhold: Arbeidsforhold[] = syncArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[SøknadFormField.arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(SøknadFormField.arbeidsforhold, updatedArbeidsforhold);
    }
};

export const getArbeidsgivere = async (
    fromDate: Date,
    toDate: Date
): Promise<AxiosResponse<ArbeidsgiverResponse> | null> => {
    try {
        const response: AxiosResponse<ArbeidsgiverResponse> = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        return response;
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
        // TODO: Return error and handle
        return null;
    }
};
