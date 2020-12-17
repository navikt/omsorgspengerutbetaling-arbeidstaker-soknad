import React from 'react';
import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import SummaryList from 'common/components/summary-list/SummaryList';
import { Bosted } from '../../../types/SøknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from './SummaryBlock';
import JaNeiSvar from './JaNeiSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

export interface Props {
    bosteder: Bosted[];
}

const MedlemskapSummaryView = (props: Props): JSX.Element | null => {
    const { bosteder } = props;
    const intl = useIntl();

    const bostederSiste12 = bosteder.filter((b) => moment(apiStringDateToDate(b.tilOgMed)).isSameOrBefore(dateToday));
    const bostederNeste12 = bosteder.filter((b) => moment(apiStringDateToDate(b.tilOgMed)).isSameOrAfter(dateToday));

    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                <JaNeiSvar harSvartJa={bostederSiste12.length > 0} />
            </SummaryBlock>

            {bostederSiste12.length > 0 && (
                <Box margin="m">
                    <SummaryList items={bostederSiste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </Box>
            )}

            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                <JaNeiSvar harSvartJa={bostederNeste12.length > 0} />
            </SummaryBlock>

            {bostederNeste12.length > 0 && (
                <SummaryList items={bostederNeste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
            )}
        </>
    );
};

export default MedlemskapSummaryView;
