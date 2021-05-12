import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime, timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { FraværÅrsak, getFraværÅrsakTekstKort, timeText } from '@navikt/sif-common-forms/lib/fravær';
import dayjs from 'dayjs';
import { UtbetalingsperiodeApi } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
}

type UtbetalingsperiodeDag = Omit<
    UtbetalingsperiodeApi,
    'fraOgMed' | 'tilOgMed' | 'antallTimerPlanlagt' | 'antallTimerBorte'
> & {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
};

export const isTime = (value: any): value is Time => {
    return value && value.hours !== undefined && value.minutes !== undefined;
};

export const isUtbetalingsperiodeDag = (p: any): p is UtbetalingsperiodeDag =>
    p && p.fraOgMed && p.antallTimerBorte !== null && p.antallTimerPlanlagt !== null;

export const toMaybeUtbetalingsperiodeDag = (p: UtbetalingsperiodeApi): UtbetalingsperiodeDag | null => {
    if (isUtbetalingsperiodeDag(p)) {
        const antallTimerPlanlagtTime: Partial<Time> | undefined = iso8601DurationToTime(p.antallTimerPlanlagt);
        const antallTimerBorteTime = iso8601DurationToTime(p.antallTimerBorte);
        if (isTime(antallTimerPlanlagtTime) && isTime(antallTimerBorteTime)) {
            return {
                dato: p.fraOgMed,
                antallTimerPlanlagt: antallTimerPlanlagtTime,
                antallTimerBorte: antallTimerBorteTime,
                årsak: p.årsak,
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

const renderÅrsakElement = (årsak: FraværÅrsak, intl: IntlShape): JSX.Element | null => {
    return årsak !== FraværÅrsak.ordinært ? (
        <div>
            {intlHelper(intl, 'steg.oppsummering.fravær.årsak', {
                årsak: getFraværÅrsakTekstKort(årsak, intl),
            })}
        </div>
    ) : null;
};

const renderEnkeltdagElement = (date: Date): JSX.Element => (
    <div>
        <span style={{ textTransform: 'capitalize' }}>{dayjs(date).format('dddd')}</span> {prettifyDate(date)}
    </div>
);

export const renderUtbetalingsperiodeDag = (dag: UtbetalingsperiodeDag, intl: IntlShape): JSX.Element => {
    const antallTimerSkulleJobbet = `${timeToDecimalTime(dag.antallTimerPlanlagt)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerPlanlagt)}`
    )}`;
    const antallTimerBorteFraJobb = `${timeToDecimalTime(dag.antallTimerBorte)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerBorte)}`
    )}`;
    return (
        <div style={{ marginBottom: '.5rem' }}>
            {renderEnkeltdagElement(apiStringDateToDate(dag.dato))}
            Skulle jobbet {antallTimerSkulleJobbet}. Borte fra jobb {antallTimerBorteFraJobb}.
            {renderÅrsakElement(dag.årsak, intl)}
        </div>
    );
};

const renderUtbetalingsperiode = (periode: UtbetalingsperiodeApi, intl: IntlShape): JSX.Element => {
    const fom = apiStringDateToDate(periode.fraOgMed);
    const tom = apiStringDateToDate(periode.tilOgMed);

    return (
        <div style={{ marginBottom: '.5rem' }}>
            {periode.fraOgMed === periode.tilOgMed ? (
                <div>
                    {renderEnkeltdagElement(fom)}
                    {renderÅrsakElement(periode.årsak, intl)}
                </div>
            ) : (
                <div>
                    Fra og med {prettifyDate(fom)}, til og med {prettifyDate(tom)}
                    {renderÅrsakElement(periode.årsak, intl)}
                </div>
            )}
        </div>
    );
};

const UtbetalingsperioderSummaryView: React.FunctionComponent<Props> = ({ utbetalingsperioder = [] }) => {
    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter(
        (p) => p.tilOgMed !== undefined && p.antallTimerBorte === null
    );
    const intl = useIntl();
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList items={perioder} itemRenderer={(periode) => renderUtbetalingsperiode(periode, intl)} />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) => renderUtbetalingsperiodeDag(dag, intl)}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
