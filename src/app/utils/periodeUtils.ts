import { FraværÅrsak } from '@navikt/sif-common-forms/lib';
import { Utbetalingsperiode } from '../types/SøknadApiData';

export const harFraværPgaSmittevernhensyn = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.smittevernhensyn) >= 0;
};

export const harFraværPgaStengBhgSkole = (perioder: Utbetalingsperiode[]): boolean => {
    return [...perioder].findIndex(({ årsak }) => årsak === FraværÅrsak.stengtSkoleBhg) >= 0;
};
