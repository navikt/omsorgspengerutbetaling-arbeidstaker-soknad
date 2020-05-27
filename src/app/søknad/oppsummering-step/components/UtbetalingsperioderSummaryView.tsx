import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, isValidTime } from 'common/utils/timeUtils';
import { Utbetalingsperiode } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';
import { isString } from 'formik';

export interface Props {
    utbetalingsperioder: Utbetalingsperiode[];
}

interface UtbetalingsperiodeDag {
    dato: string;
    time: Time;
}

const isUtbetalingsperiodeDag = (value: any): value is UtbetalingsperiodeDag => {
    return isString(value.dato) && isValidTime(value.time);
};

export const timeToStringTemporaryFix = (time: Time, intl: IntlShape, hideZeroMinutes?: boolean): string => {
    if (hideZeroMinutes && time.minutes === 0) {
        return `${time.hours} timer.`;
    }
    return `${time.hours} timer og ${time.minutes} minutter.`;
};

const UtbetalingsperioderSummaryView: React.FC<Props> = ({ utbetalingsperioder = [] }: Props): JSX.Element => {
    const intl = useIntl();

    const perioder = utbetalingsperioder.filter((p) => p.lengde === null);
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder
        .filter((p): boolean => p.lengde !== null)
        .map((dag): UtbetalingsperiodeDag | any => {
            const time: Partial<Time> | undefined = dag.lengde ? iso8601DurationToTime(dag.lengde) : undefined;
            return {
                dato: dag.fraOgMed,
                time
            };
        })
        .filter(isUtbetalingsperiodeDag);

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
                                {prettifyDate(apiStringDateToDate(dag.dato))}:{' '}
                                {timeToStringTemporaryFix(dag.time, intl, true)}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
