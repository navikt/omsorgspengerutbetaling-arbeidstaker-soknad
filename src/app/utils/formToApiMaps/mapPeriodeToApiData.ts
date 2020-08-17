import { Utbetalingsperiode } from '../../types/SøknadApiData';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export const mapFraværTilUtbetalingsperiode = (
    fraværPerioder: FraværPeriode[],
    fraværDager: FraværDag[]
): Utbetalingsperiode[] => {
    const periodeMappedTilUtbetalingsperiode: Utbetalingsperiode[] = fraværPerioder.map(
        (periode: FraværPeriode): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(periode.from),
                tilOgMed: formatDateToApiFormat(periode.to),
                antallTimerPlanlagt: null,
                antallTimerBorte: null,
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: Utbetalingsperiode[] = fraværDager.map(
        (fravær: FraværDag): Utbetalingsperiode => {
            const utbetalingsperiode = {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(parseFloat(fravær.timerArbeidsdag))),
                antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(parseFloat(fravær.timerFravær))),
            };
            return utbetalingsperiode;
        }
    );

    // TODO: Ingen periode, ingen penger. Eskaler feil...
    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};
