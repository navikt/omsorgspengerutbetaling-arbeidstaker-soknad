import { Arbeidsgiver, ArbeidsgiverResponse } from '../types/Søkerdata';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { relocateToLoginPage } from './navigationUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';
import { ArbeidsforholdFormData, Utbetalingsårsak } from '../types/ArbeidsforholdTypes';
import appSentryLogger from './appSentryLogger';
import { SøknadFormData } from '../types/SøknadFormData';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import { Utbetalingsperiode } from '../types/SøknadApiData';
import { mapFraværTilUtbetalingsperiode } from './formToApiMaps/mapPeriodeToApiData';
import { getArbeidsgiver } from '../api/getArbeidsgiver';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';

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
            utbetalingsårsak: a ? a.utbetalingsårsak : Utbetalingsårsak.ikkeBesvart,
            årsakNyoppstartet: a ? a.årsakNyoppstartet : undefined,
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
        if (isForbidden(error) || isUnauthorized(error)) {
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
        return null;
    }
};

export const getAlleUtbetalingsperioder = (arbeidsforholder: ArbeidsforholdFormData[]): Utbetalingsperiode[] => {
    const arbeidsforholdPerioder: FraværPeriode[] = arbeidsforholder
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværPerioder;
        })
        .flat();

    const arbeidsforholdDager: FraværDag[] = arbeidsforholder
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværDager;
        })
        .flat();

    return mapFraværTilUtbetalingsperiode(arbeidsforholdPerioder, arbeidsforholdDager);
};

export const getAlleFraværDager = (values: SøknadFormData): FraværDag[] => {
    const arbeidsforholdDager: FraværDag[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværDager;
        })
        .flat();
    return arbeidsforholdDager;
};

export const getAlleFraværPerioder = (values: SøknadFormData): FraværPeriode[] => {
    const arbeidsforholdPerioder: FraværPeriode[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværPerioder;
        })
        .flat();

    return arbeidsforholdPerioder;
};
