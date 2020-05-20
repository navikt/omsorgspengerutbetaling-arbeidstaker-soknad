import { Utbetalingsperiode } from '../../types/SøknadApiData';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): Utbetalingsperiode[] => {
    const periodeMappedTilUtbetalingsperiode: Utbetalingsperiode[] = perioderMedFravær.map(
        (periode: Periode): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom),
                tilOgMed: formatDateToApiFormat(periode.tom),
                lengde: null
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: Utbetalingsperiode[] = dagerMedDelvisFravær.map(
        (fravær: FraværDelerAvDag): Utbetalingsperiode => {
            const duration: string = timeToIso8601Duration(decimalTimeToTime(fravær.timer));
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                lengde: duration
            };
        }
    );

    // TODO: Ingen periode, ingen penger. Eskaler feil...
    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};
