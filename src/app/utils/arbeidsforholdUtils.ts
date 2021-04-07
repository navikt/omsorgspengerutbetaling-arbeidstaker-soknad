import { Arbeidsgiver, ArbeidsgiverResponse } from 'app/types/Søkerdata';
import { getArbeidsgiver } from 'app/api/api';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { navigateToLoginPage } from './navigationUtils';
import { apiUtils } from './apiUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { AxiosResponse } from 'axios';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../types/ArbeidsforholdTypes';
import { HvorLengeJobbet, HvorLengeJobbetFordi } from '../types/AnsettelseslengdeTypes';
import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import appSentryLogger from './appSentryLogger';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import { Utbetalingsperiode } from '../types/SøknadApiData';
import { mapFraværTilUtbetalingsperiode } from './formToApiMaps/mapPeriodeToApiData';

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
            ansettelseslengde: a
                ? a.ansettelseslengde
                : {
                      hvorLengeJobbet: HvorLengeJobbet.IKKE_BESVART,
                      begrunnelse: HvorLengeJobbetFordi.IKKE_BESVART,
                      ingenAvSituasjoneneForklaring: '',
                  },
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

export const getAnnetArbeidsforholdField = (annetArbeidsforholdFieldName: ArbeidsforholdFormDataFields): string => {
    return `${SøknadFormField.annetArbeidsforhold}.${annetArbeidsforholdFieldName}`;
};

export const getAlleUtbetalingsperioder = (values: SøknadFormData): Utbetalingsperiode[] => {
    const arbeidsforholdPerioder: FraværPeriode[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværPerioder;
        })
        .flat();

    const arbeidsforholdDager: FraværDag[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværDager;
        })
        .flat();

    const annetPeriode: FraværPeriode[] = values.annetArbeidsforhold.fraværPerioder;
    const annetDag: FraværDag[] = values.annetArbeidsforhold.fraværDager;

    return mapFraværTilUtbetalingsperiode(
        [...arbeidsforholdPerioder, ...annetPeriode],
        [...arbeidsforholdDager, ...annetDag]
    );
};

export const getAlleFraværDager = (values: SøknadFormData): FraværDag[] => {
    const arbeidsforholdDager: FraværDag[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværDager;
        })
        .flat();
    const annetDag: FraværDag[] = values.annetArbeidsforhold.fraværDager;
    return [...arbeidsforholdDager, ...annetDag];
};

export const getAlleFraværPerioder = (values: SøknadFormData): FraværPeriode[] => {
    const arbeidsforholdPerioder: FraværPeriode[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværPerioder;
        })
        .flat();
    const annetPeriode: FraværPeriode[] = values.annetArbeidsforhold.fraværPerioder;
    return [...arbeidsforholdPerioder, ...annetPeriode];
};
