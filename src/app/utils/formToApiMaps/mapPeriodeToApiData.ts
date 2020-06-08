import { Utbetalingsperiode } from '../../types/SøknadApiData';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';

export const mapFraværTilUtbetalingsperiode = (
    perioderMedFravær: FraværPeriode[],
    dagerMedDelvisFravær: FraværDag[]
): Utbetalingsperiode[] => {
    const periodeMappedTilUtbetalingsperiode: Utbetalingsperiode[] = perioderMedFravær.map(
        (periode: FraværPeriode): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(periode.from),
                tilOgMed: formatDateToApiFormat(periode.to),
                antallTimerPlanlagt: null,
                antallTimerBorte: null
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: Utbetalingsperiode[] = dagerMedDelvisFravær.map(
        (fravær: FraværDag): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(fravær.timerArbeidsdag)),
                antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(fravær.timerFravær))
            };
        }
    );

    // TODO: Ingen periode, ingen penger. Eskaler feil...
    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};
