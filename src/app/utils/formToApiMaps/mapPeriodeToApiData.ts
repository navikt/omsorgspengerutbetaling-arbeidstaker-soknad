import { ApiAktivitet, Utbetalingsperiode } from '../../types/SøknadApiData';
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
                fraOgMed: formatDateToApiFormat(periode.fraOgMed),
                tilOgMed: formatDateToApiFormat(periode.tilOgMed),
                antallTimerPlanlagt: null,
                antallTimerBorte: null,
                årsak: periode.årsak,
                aktivitetFravær: [ApiAktivitet.ARBEIDSTAKER],
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
                årsak: fravær.årsak,
                aktivitetFravær: [ApiAktivitet.ARBEIDSTAKER],
            };
            return utbetalingsperiode;
        }
    );

    // TODO: Ingen periode, ingen penger. Eskaler feil...
    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};
