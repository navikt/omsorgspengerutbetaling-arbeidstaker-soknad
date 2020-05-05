import { Arbeidsgiver, ArbeidsgiverResponse } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { FormikProps } from 'formik';
import {
    AnsettelseslengdeFormDataFields,
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    SøknadFormData,
    SøknadFormField
} from '../types/SøknadFormData';
import { apiUtils } from './apiUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import { Attachment } from 'common/types/Attachment';

export const syncArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsforholdFormData[] => {
    const arbeidsforholdUpdatedList: ArbeidsforholdFormData[] = arbeidsgivere.map((arbeidsgiver: Arbeidsgiver) => {
        const a: ArbeidsforholdFormData | undefined = arbeidsforhold.find(
            (f) => f.organisasjonsnummer === arbeidsgiver.organisasjonsnummer
        );

        return {
            ...arbeidsgiver,
            [ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]: a
                ? a[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]
                : YesOrNo.UNANSWERED,
            [ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]: a
                ? a[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]
                : YesOrNo.UNANSWERED,
            [ArbeidsforholdFormDataFields.ansettelseslengde]: a
                ? a[ArbeidsforholdFormDataFields.ansettelseslengde]
                : {
                    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
                    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
                    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: null
                },
            [ArbeidsforholdFormDataFields.harPerioderMedFravær]: a
                ? a[ArbeidsforholdFormDataFields.harPerioderMedFravær]
                : YesOrNo.UNANSWERED,
            [ArbeidsforholdFormDataFields.perioderMedFravær]: a
                ? a[ArbeidsforholdFormDataFields.perioderMedFravær]
                : [],
            [ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]: a
                ? a[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær]
                : YesOrNo.UNANSWERED,
            [ArbeidsforholdFormDataFields.dagerMedDelvisFravær]: a
                ? a[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                : [],
            [ArbeidsforholdFormDataFields.dokumenter]: a
                ? a[ArbeidsforholdFormDataFields.dokumenter]
                : [],
        };
    });
    return arbeidsforholdUpdatedList;
};

export const updateArbeidsforhold = (formikProps: FormikProps<SøknadFormData>, arbeidsgivere: Arbeidsgiver[]) => {
    const updatedArbeidsforhold: ArbeidsforholdFormData[] = syncArbeidsforholdWithArbeidsgivere(
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
        const response: AxiosResponse<ArbeidsgiverResponse> = await getArbeidsgiver(
            formatDateToApiFormat(fromDate),
            formatDateToApiFormat(toDate)
        );
        return response;
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
        // TODO: Return error and handle
        return null;
    }
};
