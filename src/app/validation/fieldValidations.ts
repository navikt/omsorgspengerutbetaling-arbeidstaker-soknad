import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ValidateRequiredFieldError } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
// import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Attachment } from 'common/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from 'common/utils/attachmentUtils';
import {
    date1YearAgo,
    // date1YearFromNow,
    DateRange,
    dateRangesCollide,
    // dateRangesExceedsRange,
    dateToday,
} from 'common/utils/dateUtils';
import { FraværDelerAvDag, Periode } from '../types/PeriodeTypes';
import { datesCollide } from './dateValidationUtils';

dayjs.extend(isBetween);

export const hasValue = (v: any): boolean => v !== '' && v !== undefined && v !== null;

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fraværsperioder_mangler' = 'fieldvalidation.fraværsperioder_mangler',
    'fraværsperioder_overlapper' = 'fieldvalidation.fraværsperioder_overlapper',
    'fraværsperioder_utenfor_periode' = 'fieldvalidation.fraværsperioder_utenfor_periode',
    'fraværsperioder_overlapper_med_fraværsdager' = 'fieldvalidation.fraværsperioder_overlapper_med_fraværsdager',
    'dager_med_fravær_ugyldig_dag' = 'fieldvalidation.dager_med_fravær_ugyldig_dag',
    'dager_med_fravær_mangler' = 'fieldvalidation.dager_med_fravær_mangler',
    'dager_med_fravær_like' = 'fieldvalidation.dager_med_fravær_like',
    'dager_med_fravær_utenfor_periode' = 'fieldvalidation.dager_med_fravær_utenfor_periode',
    'dager_med_for_mange_timer' = 'fieldvalidation.dager_med_for_mange_timer',
    'dager_med_fravær_overlapper_perioder' = 'fieldvalidation.dager_med_fravær_overlapper_perioder',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'tom_er_før_fom' = 'fieldvalidation.tom_er_før_fom',
    'tom_er_i_fremtiden' = 'fieldvalidation.tom_er_i_fremtiden',
    'arbeidsforhold_prosentUgyldig' = 'fieldvalidation.arbeidsforhold_prosentUgyldig',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',
    'samlet_storrelse_for_hoy' = 'fieldvalidation.samlet_storrelse_for_hoy',
    'ingen_dokumenter' = 'fieldvalidation.ingen_dokumenter',
    'ikke_lørdag_eller_søndag_periode' = 'fieldvalidation.saturday_and_sunday_not_possible_periode',
    'ikke_lørdag_eller_søndag_dag' = 'fieldvalidation.saturday_and_sunday_not_possible_dag',

    'førsteDagMedFravære_påkrevd' = 'fieldvalidation.førsteDagMedFravære_påkrevd',
    'førsteDagMedFravære_ugyldigTidsperiode' = 'fieldvalidation.førsteDagMedFravære_ugyldigTidsperiode',
    'sisteDagMedFravære_påkrevd' = 'fieldvalidation.sisteDagMedFravære_påkrevd',
    'sisteDagMedFravære_ugyldigTidsperiode' = 'fieldvalidation.sisteDagMedFravære_ugyldigTidsperiode',
    'sisteDagMedFravære_ikkeSammeÅrSomFørsteDag' = 'fieldvalidation.sisteDagMedFravære_ikkeSammeÅrSomFørsteDag',

    'fraværDagIkkeSammeÅrstall' = 'fieldvalidation.fraværDagIkkeSammeÅrstall',
    'fraværPeriodeIkkeSammeÅrstall' = 'fieldvalidation.fraværPeriodeIkkeSammeÅrstall',
}

// export const createAppFieldValidationError = (
//     error: AppFieldValidationErrors | AppFieldValidationErrors,
//     values?: any
// ): ValidationResult<ValidationError> => {
//     return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
// };

// export const validateAll: FieldValidationArray = (validations: FormikValidateFunction[]) => (
//     value: any
// ): ValidationResult<ValidationError> => {
//     let result: ValidationResult<ValidationErroValidationResultr>;
//     validations.some((validate) => {
//         const r = validate(value);
//         if (r) {
//             result = r;
//             return true;
//         }
//         return false;
//     });
//     return result;
// };

// -------------------------------------------------
// MedlemsskapStep
// -------------------------------------------------

// export const validateUtenlandsoppholdSiste12Mnd = (
//     utenlandsopphold: Utenlandsopphold[]
// ): ValidationResult<ValidationError> => {
//     if (utenlandsopphold.length === 0) {
//         return AppFieldValidationErrors.utenlandsopphold_ikke_registrert;
//     }
//     const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
//     if (dateRangesCollide(dateRanges)) {
//         return AppFieldValidationErrors.utenlandsopphold_overlapper;
//     }
//     if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
//         return AppFieldValidationErrors.utenlandsopphold_utenfor_periode;
//     }

//     return undefined;
// };

// export const validateUtenlandsoppholdNeste12Mnd = (
//     utenlandsopphold: Utenlandsopphold[]
// ): ValidationResult<ValidationError> => {
//     if (utenlandsopphold.length === 0) {
//         return AppFieldValidationErrors.utenlandsopphold_ikke_registrert;
//     }
//     const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
//     if (dateRangesCollide(dateRanges)) {
//         return AppFieldValidationErrors.utenlandsopphold_overlapper;
//     }
//     if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
//         return AppFieldValidationErrors.utenlandsopphold_utenfor_periode;
//     }
//     return undefined;
// };

// -------------------------------------------------
// PeriodeStep
// -------------------------------------------------

const datoErInnenforTidsrom = (dato: Date, range: Partial<DateRange>): boolean => {
    if (range.from && range.to) {
        return dayjs(dato).isBetween(range.from, range.to, 'days', '[]');
    }
    if (range.from) {
        return dayjs(dato).isSameOrAfter(range.from);
    }
    if (range.to) {
        return dayjs(dato).isSameOrBefore(range.to);
    }
    return true;
};

const isPeriodeMedFomTom = (periode: Periode): boolean => {
    return periode.fom !== undefined && periode.tom !== undefined;
};

export const harLikeDager = (dager: FraværDelerAvDag[]): boolean => {
    return datesCollide(dager.map((d) => d.dato));
};

export const validateTomAfterFom = (fom: Date) => (date: Date): ValidationResult<ValidationError | undefined> => {
    if (dayjs(date).isBefore(fom)) {
        return AppFieldValidationErrors.tom_er_før_fom;
    }
    return undefined;
};

export const validateDateNotInFuture = () => (date: Date): ValidationResult<ValidationError | undefined> => {
    if (dayjs(date).isAfter(dateToday)) {
        return AppFieldValidationErrors.tom_er_i_fremtiden;
    }
    return undefined;
};

export const datesCollideWithDateRanges = (dates: Date[], ranges: DateRange[]): boolean => {
    if (ranges.length > 0 && dates.length > 0) {
        return dates.some((d) => {
            return ranges.some((range) => dayjs(d).isSameOrAfter(range.from) && dayjs(d).isSameOrBefore(range.to));
        });
    }
    return false;
};

const perioderMedFraværToDateRanges = (perioder: Periode[]): DateRange[] =>
    perioder.map((periode: Periode) => ({ from: periode.fom, to: periode.tom }));

export const validatePerioderMedFravær = (
    allePerioder: Periode[],
    dagerMedGradvisFravær: FraværDelerAvDag[]
): ValidationResult<ValidationError> => {
    if (allePerioder.length === 0) {
        return AppFieldValidationErrors.fraværsperioder_mangler;
    }
    const perioder = allePerioder.filter(isPeriodeMedFomTom);
    const dateRanges: DateRange[] = perioderMedFraværToDateRanges(perioder);
    if (dateRangesCollide(dateRanges)) {
        return AppFieldValidationErrors.fraværsperioder_overlapper;
    }
    if (
        datesCollideWithDateRanges(
            dagerMedGradvisFravær.map((d) => d.dato),
            dateRanges
        )
    ) {
        return AppFieldValidationErrors.fraværsperioder_overlapper_med_fraværsdager;
    }
    return undefined;
};

export const validateDagerMedFravær = (
    dagerMedGradvisFravær: FraværDelerAvDag[],
    perioderMedFravær: Periode[]
): ValidationResult<ValidationError> => {
    if (dagerMedGradvisFravær.length === 0) {
        return AppFieldValidationErrors.dager_med_fravær_mangler;
    }
    const dager = dagerMedGradvisFravær.filter(
        (d) => d.dato !== undefined && d.timer !== undefined && isNaN(d.timer) === false
    );

    if (harLikeDager(dager)) {
        return AppFieldValidationErrors.dager_med_fravær_like;
    }
    const dateRanges: DateRange[] = perioderMedFraværToDateRanges(perioderMedFravær);
    if (
        datesCollideWithDateRanges(
            dagerMedGradvisFravær.map((d) => d.dato),
            dateRanges
        )
    ) {
        return AppFieldValidationErrors.dager_med_fravær_overlapper_perioder;
    }

    return undefined;
};

export const validateDateInRange = (tidsrom: Partial<DateRange>) => (date: any): ValidationResult<ValidationError> => {
    if (!datoErInnenforTidsrom(date, tidsrom)) {
        return AppFieldValidationErrors.dato_utenfor_gyldig_tidsrom;
    }
    return undefined;
};

export const validateHours = ({ min, max }: { min?: number; max?: number }) => (
    value: any
): ValidationResult<ValidationError> => {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return AppFieldValidationErrors.timer_ikke_tall;
    }
    if ((min !== undefined && num < min) || (max !== undefined && value > max)) {
        return AppFieldValidationErrors.timer_for_mange_timer;
    }
    return undefined;
};

export const validateReduserteArbeidProsent = (
    value: number | string,
    isRequired?: boolean
): ValidationResult<ValidationError> => {
    if (isRequired && !hasValue(value)) {
        return ValidateRequiredFieldError.noValue;
    }
    const prosent = typeof value === 'string' ? parseFloat(value) : value;

    if (prosent < 1 || prosent > 100) {
        return AppFieldValidationErrors.arbeidsforhold_prosentUgyldig;
    }
    return undefined;
};

export const attachmentsAreValid = (attachments: Attachment[]): boolean => {
    const uploadedAttachments = attachments.filter((attachment) => {
        return attachment ? attachmentHasBeenUploaded(attachment) : false;
    });
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return false;
    }
    if (uploadedAttachments.length > 100) {
        return false;
    }
    return true;
};

export const alleDokumenterISøknadenToFieldValidationResult = (
    attachments: Attachment[]
): ValidationResult<ValidationError> => {
    const uploadedAttachments = attachments.filter((attachment) => {
        return attachment ? attachmentHasBeenUploaded(attachment) : false;
    });
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    // if (uploadedAttachments.length === 0) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.ingen_dokumenter);
    // }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.for_mange_dokumenter;
    }
    return undefined;
};

export const validateFørsteDagMedFravær = (value: string | undefined): ValidationResult<ValidationError> => {
    const førsteDag = datepickerUtils.getDateFromDateString(value);
    if (førsteDag === undefined) {
        return AppFieldValidationErrors.førsteDagMedFravære_påkrevd;
    }
    if (dayjs(førsteDag).isBefore(date1YearAgo, 'day') || dayjs(førsteDag).isAfter(dateToday, 'day')) {
        return AppFieldValidationErrors.førsteDagMedFravære_ugyldigTidsperiode;
    }

    return undefined;
};

export const validateSisteDagMedFravær = (
    value: string | undefined,
    førsteDagMedFravær: string | undefined
): ValidationResult<ValidationError> => {
    const førsteDag = datepickerUtils.getDateFromDateString(førsteDagMedFravær);
    const sisteDag = datepickerUtils.getDateFromDateString(value);
    if (sisteDag === undefined) {
        return AppFieldValidationErrors.sisteDagMedFravære_påkrevd;
    }
    if (dayjs(sisteDag).isBefore(førsteDag || date1YearAgo, 'day') || dayjs(sisteDag).isAfter(dateToday, 'day')) {
        return AppFieldValidationErrors.sisteDagMedFravære_ugyldigTidsperiode;
    }
    if (førsteDag && dayjs(sisteDag).get('year') !== dayjs(førsteDag).get('year')) {
        return AppFieldValidationErrors.sisteDagMedFravære_ikkeSammeÅrSomFørsteDag;
    }
    return undefined;
};

export const validateFraværDagHarÅrstall = (
    dager: FraværDag[],
    årstall?: number
): ValidationResult<ValidationError> => {
    if (årstall !== undefined) {
        return dager.find((d) => d.dato.getFullYear() !== årstall)
            ? AppFieldValidationErrors.fraværDagIkkeSammeÅrstall
            : undefined;
    }
    return undefined;
};
export const validateFraværPeriodeHarÅrstall = (
    perioder: FraværPeriode[],
    årstall?: number
): ValidationResult<ValidationError> => {
    if (årstall !== undefined) {
        return perioder.find((p) => p.fraOgMed.getFullYear() !== årstall || p.tilOgMed.getFullYear() !== årstall)
            ? AppFieldValidationErrors.fraværPeriodeIkkeSammeÅrstall
            : undefined;
    }
    return undefined;
};
