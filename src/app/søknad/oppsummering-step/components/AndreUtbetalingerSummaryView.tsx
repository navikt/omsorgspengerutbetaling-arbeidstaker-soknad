import SummaryBlock from './SummaryBlock';
import intlHelper from 'common/utils/intlUtils';
import SummaryList from 'common/components/summary-list/SummaryList';
import React from 'react';
import { useIntl } from 'react-intl';

interface Props {
    andreUtbetalinger: string[];
}

const AndreUtbetalingerSummaryView: React.FC<Props> = ({ andreUtbetalinger }: Props): JSX.Element => {
    const intl = useIntl();
    return (
        <>
            {andreUtbetalinger.length > 0 && (
                <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søkt_om_andre_utbetalinger')}>
                    <SummaryList
                        items={andreUtbetalinger}
                        itemRenderer={(utbetaling): JSX.Element => (
                            <span>{intlHelper(intl, `andre_utbetalinger.${utbetaling}`)}</span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default AndreUtbetalingerSummaryView;
