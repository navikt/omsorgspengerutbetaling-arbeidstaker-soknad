import { FraværÅrsak } from '@navikt/sif-common-forms/lib';
import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { Utbetalingsperiode } from '../types/SøknadApiData';

dayjs.extend(minMax);

export const getPeriodeBoundaries = (utbetalingsperiode: Utbetalingsperiode[]): { min?: Date; max?: Date } => {
    let min: Dayjs | undefined;
    let max: Dayjs | undefined;

    utbetalingsperiode.forEach((p) => {
        min = min ? dayjs.min(dayjs(p.fraOgMed), min) : dayjs(p.fraOgMed);
        max = max ? dayjs.max(dayjs(p.tilOgMed), max) : dayjs(p.tilOgMed);
    });

    return {
        min: min !== undefined ? min.toDate() : undefined,
        max: max !== undefined ? max.toDate() : undefined,
    };
};

// export const erHelg = (date: Date): boolean => {
//     const dayName = date.getDay();
//     return dayName === 0 || dayName === 6;
// };

// export const validatePeriodeNotWeekend = (date: Date): FieldValidationResult =>
//     erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_periode) : undefined;

// export const validateFraværDelerAvDagNotWeekend = (date: Date): FieldValidationResult =>
//     erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_dag) : undefined;

export const harFraværPgaSmittevernhensyn = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.smittevernhensyn) >= 0;
};

export const harFraværPgaStengBhgSkole = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.stengtSkoleBhg) >= 0;
};
