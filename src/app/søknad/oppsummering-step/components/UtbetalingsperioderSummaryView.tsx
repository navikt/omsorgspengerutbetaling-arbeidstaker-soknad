import React from 'react';
import { IntlShape, useIntl, FormattedMessage } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from 'common/types/Time';
import { apiStringDateToDate, prettifyDate, prettifyDateExtended } from 'common/utils/dateUtils';
import { iso8601DurationToTime, timeToDecimalTime } from 'common/utils/timeUtils';
import { Utbetalingsperiode } from '../../../types/SøknadApiData';
import SummaryBlock from './SummaryBlock';
import { isString } from 'formik';
import { FraværÅrsak, timeText, getFraværÅrsakTekstKort } from '@navikt/sif-common-forms/lib/fravær';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

export interface Props {
    utbetalingsperioder: Utbetalingsperiode[];
}

type UtbetalingsperiodeDag = Omit<
    Utbetalingsperiode,
    'fraOgMed' | 'tilOgMed' | 'antallTimerPlanlagt' | 'antallTimerBorte'
> & {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
};

const isUtbetalingsperiode = (value: any): value is Utbetalingsperiode => {
    return isString(value.fraOgMed) && isString(value.tilOgMed) && value.antallTimerPlanlagt && value.antallTimerBorte;
};

export const timeToStringTemporaryFix = (time: Time, intl: IntlShape, hideZeroMinutes?: boolean): string => {
    if (hideZeroMinutes && time.minutes === 0) {
        return `${time.hours} timer`;
    }
    return `${time.hours} timer og ${time.minutes} minutter`;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

export const utbetalingsperiodeDagToDagSummaryStringView = (
    dag: UtbetalingsperiodeDag,
    intl?: IntlShape
): JSX.Element => {
    const antallTimerSkulleJobbet = `${timeToDecimalTime(dag.antallTimerPlanlagt)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerPlanlagt)}`
    )}`;
    const antallTimerBorteFraJobb = `${timeToDecimalTime(dag.antallTimerBorte)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerBorte)}`
    )}`;
    return (
        <>
            <FormattedMessage
                tagName="span"
                id="step.oppsummering.arbeidsforhold.delvisFravær.item"
                values={{
                    dato: prettifyDateExtended(apiStringDateToDate(dag.dato)),
                    timerSkulleJobbet: antallTimerSkulleJobbet,
                    timerBorte: antallTimerBorteFraJobb,
                }}
            />
            {renderÅrsakElement(dag.årsak, intl)}
        </>
    );
};

const renderÅrsakElement = (årsak: FraværÅrsak, intl?: IntlShape): JSX.Element | null => {
    return årsak !== FraværÅrsak.ordinært && intl ? (
        <div>
            {intlHelper(intl, 'steg.oppsummering.fravær.årsak', {
                årsak: getFraværÅrsakTekstKort(årsak, intl),
            })}
        </div>
    ) : null;
};
const UtbetalingsperioderSummaryView: React.FC<Props> = ({ utbetalingsperioder = [] }: Props): JSX.Element => {
    const intl = useIntl();

    const perioder = utbetalingsperioder.filter((p) => p.antallTimerBorte === null);
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.fravær.heleDager.header')}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode: Utbetalingsperiode): JSX.Element => (
                            <>
                                <FormattedMessage
                                    tagName="span"
                                    id="step.oppsummering.arbeidsforhold.fravær.heleDager.item"
                                    values={{
                                        fom: prettifyDate(apiStringDateToDate(periode.fraOgMed)),
                                        tom: prettifyDate(apiStringDateToDate(periode.tilOgMed)),
                                    }}
                                />
                                {renderÅrsakElement(periode.årsak, intl)}
                            </>
                        )}
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.delvisFravær.header')}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) =>
                            utbetalingsperiodeDagToDagSummaryStringView(dag, intl)
                        }
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
