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

export const harFraværPgaSmittevernhensyn = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.smittevernhensyn) >= 0;
};

export const harFraværPgaStengBhgSkole = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.stengtSkoleBhg) >= 0;
};
