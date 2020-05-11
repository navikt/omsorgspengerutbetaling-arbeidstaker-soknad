import { Arbeidsgiver, ArbeidsgiverResponse } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { apiUtils } from './apiUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../types/ArbeidsforholdTypes';
import {
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi
} from '../types/AnsettelseslengdeTypes';
import { SøknadFormField } from '../types/SøknadFormData';
import { logApiCallErrorToSentryOrConsole } from './sentryUtils';
import { skalInkludereArbeidsforhold } from './formToApiMaps/mapArbeidsforholdToApiData';

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
                      [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: ''
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
            [ArbeidsforholdFormDataFields.dokumenter]: a ? a[ArbeidsforholdFormDataFields.dokumenter] : []
        };
    });
    return arbeidsforholdUpdatedList;
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
        } else {
            logApiCallErrorToSentryOrConsole(error);
        }
        return null;
    }
};

export const getAnnetArbeidsforholdField = (annetArbeidsforholdFieldName: ArbeidsforholdFormDataFields): string => {
    return `${SøknadFormField.annetArbeidsforhold}.${annetArbeidsforholdFieldName}`;
};

export const harMinimumEtArbeidsforholdMedVidereISøknaden = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): boolean => {
    return listeAvArbeidsforhold
            .map((arbeidsforhold: ArbeidsforholdFormData) => {
                return skalInkludereArbeidsforhold(arbeidsforhold);
            })
            .filter((skalInkludere: boolean) => {
                return skalInkludere === true;
            }).length > 0;
};
