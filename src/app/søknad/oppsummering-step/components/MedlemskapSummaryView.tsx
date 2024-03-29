import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import SummaryList from 'common/components/summary-list/SummaryList';
import { Bosted } from '../../../types/SøknadApiData';
import JaNeiSvar from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/JaNeiSvar';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export interface Props {
    bosteder: Bosted[];
}

const MedlemskapSummaryView = (props: Props): JSX.Element | null => {
    const { bosteder } = props;
    const intl = useIntl();

    const bostederSiste12 = bosteder.filter((b) => dayjs(apiStringDateToDate(b.tilOgMed)).isSameOrBefore(dateToday));
    const bostederNeste12 = bosteder.filter((b) => dayjs(apiStringDateToDate(b.tilOgMed)).isSameOrAfter(dateToday));

    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utlandetSiste12.header')}>
                <JaNeiSvar harSvartJa={bostederSiste12.length > 0} />
            </SummaryBlock>

            {bostederSiste12.length > 0 && (
                <Box margin="m">
                    <SummaryList items={bostederSiste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
                </Box>
            )}

            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utlandetNeste12.header')}>
                <JaNeiSvar harSvartJa={bostederNeste12.length > 0} />
            </SummaryBlock>

            {bostederNeste12.length > 0 && (
                <SummaryList items={bostederNeste12} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
            )}
        </>
    );
};

export default MedlemskapSummaryView;
