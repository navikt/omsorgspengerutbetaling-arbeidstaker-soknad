import { Arbeidsgiver, ArbeidsgiverResponse } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { apiUtils } from './apiUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';
import appSentryLogger from './appSentryLogger';

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
            arbeidsgiverHarUtbetaltLønn: a ? a.arbeidsgiverHarUtbetaltLønn : YesOrNo.UNANSWERED,
            harHattFraværHosArbeidsgiver: a ? a.harHattFraværHosArbeidsgiver : YesOrNo.UNANSWERED,
            utbetalingsårsak: a ? a.utbetalingsårsak : undefined,
            konfliktForklaring: a ? a.konfliktForklaring : undefined,
            harPerioderMedFravær: a ? a.harPerioderMedFravær : YesOrNo.UNANSWERED,
            fraværPerioder: a ? a.fraværPerioder : [],
            harDagerMedDelvisFravær: a ? a.harDagerMedDelvisFravær : YesOrNo.UNANSWERED,
            fraværDager: a ? a.fraværDager : [],
            dokumenter: a ? a.dokumenter : [],
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
            appSentryLogger.logApiError(error);
        }
        return null;
    }
};
