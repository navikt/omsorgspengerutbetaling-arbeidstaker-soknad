import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, isValidTime, timeToString } from 'common/utils/timeUtils';
import { Utbetalingsperiode } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';
import { isString } from 'formik';

export interface Props {
    utbetalingsperioder: Utbetalingsperiode[];
}

interface UtbetalingsperiodeDag {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
}

const isUtbetalingsperiode = (value: any): value is Utbetalingsperiode => {
    return isString(value.fraOgMed) && isString(value.tilOgMed) && value.antallTimerPlanlagt && value.antallTimerBorte;
};

export const timeToStringTemporaryFix = (time: Time, intl: IntlShape, hideZeroMinutes?: boolean): string => {
    if (hideZeroMinutes && time.minutes === 0) {
        return `${time.hours} timer`;
    }
    return `${time.hours} timer og ${time.minutes} minutter`;
};

export const isTime = (value: any): value is Time => {
    return value && value.hours !== undefined && value.minutes !== undefined;
};

export const toMaybeUtbetalingsperiodeDag = (p: Utbetalingsperiode): UtbetalingsperiodeDag | null => {
    if (isUtbetalingsperiode(p)) {
        const antallTimerPlanlagtTime: Partial<Time> | undefined = p.antallTimerPlanlagt
            ? iso8601DurationToTime(p.antallTimerPlanlagt)
            : undefined;
        const antallTimerBorteTime: Partial<Time> | undefined = p.antallTimerBorte
            ? iso8601DurationToTime(p.antallTimerBorte)
            : undefined;
        if (isTime(antallTimerPlanlagtTime) && isTime(antallTimerBorteTime)) {
            return {
                dato: p.fraOgMed,
                antallTimerPlanlagt: antallTimerPlanlagtTime,
                antallTimerBorte: antallTimerBorteTime
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

const UtbetalingsperioderSummaryView: React.FC<Props> = ({ utbetalingsperioder = [] }: Props): JSX.Element => {
    const intl = useIntl();

    const perioder = utbetalingsperioder.filter((p) => p.antallTimerBorte === null);
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode: Utbetalingsperiode): JSX.Element => (
                            <span>
                                Fra og med {prettifyDate(apiStringDateToDate(periode.fraOgMed))}, til og med{' '}
                                {prettifyDate(apiStringDateToDate(periode.tilOgMed))}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag): JSX.Element => (
                            <span>
                                {prettifyDate(apiStringDateToDate(dag.dato))}: Skulle jobbet:{' '}
                                {timeToString(dag.antallTimerPlanlagt, intl, true)}. Borte fra jobb:{' '}
                                {timeToString(dag.antallTimerBorte, intl, true)}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
