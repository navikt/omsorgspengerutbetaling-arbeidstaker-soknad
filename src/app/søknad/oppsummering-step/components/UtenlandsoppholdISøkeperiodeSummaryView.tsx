import React from 'react';
import { useIntl } from 'react-intl';
import SummaryList from 'common/components/summary-list/SummaryList';
import intlHelper from 'common/utils/intlUtils';
import { Bosted } from '../../../types/SøknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from './SummaryBlock';
import SummarySection from './summary-section/SummarySection';

export interface Props {
    utenlandsopphold: Bosted[];
}

const UtenlandsoppholdISøkeperiodeSummaryView: React.FC<Props> = ({ utenlandsopphold }: Props): JSX.Element | null => {
    const intl = useIntl();
    return utenlandsopphold && utenlandsopphold.length > 0 ? (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.utenlandsopphold.titel')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
                <SummaryList items={utenlandsopphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
            </SummaryBlock>
        </SummarySection>
    ) : null;
};

export default UtenlandsoppholdISøkeperiodeSummaryView;
