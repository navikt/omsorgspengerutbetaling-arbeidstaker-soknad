import React from 'react';
import { useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import { iso8601DurationToTime, timeToString } from 'common/utils/timeUtils';
import { Utbetalingsperiode } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';

export interface Props {
    utbetalingsperioder: Utbetalingsperiode[];
}

interface UtbetalingsperiodeDag {
    dato: string;
    time: Time;
}

function UtbetalingsperioderSummaryView({ utbetalingsperioder = [] }: Props) {
    const intl = useIntl();

    const perioder = utbetalingsperioder.filter((p) => p.tilOgMed !== undefined);
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder
        .filter((p) => p.lengde !== undefined)
        .map((dag) => {
            const time: Time = iso8601DurationToTime(dag.lengde!) as Time;
            return {
                dato: dag.fraOgMed,
                time
            };
        });

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode: Utbetalingsperiode) => (
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
                        itemRenderer={(dag: UtbetalingsperiodeDag) => (
                            <span>
                                {prettifyDate(apiStringDateToDate(dag.dato))}: {timeToString(dag.time, intl, true)}
                            </span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
}

export default UtbetalingsperioderSummaryView;
