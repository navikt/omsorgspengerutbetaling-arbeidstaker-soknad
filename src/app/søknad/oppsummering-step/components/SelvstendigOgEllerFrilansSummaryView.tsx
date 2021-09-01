import SummaryBlock from './SummaryBlock';
import intlHelper from 'common/utils/intlUtils';
import SummaryList from 'common/components/summary-list/SummaryList';
import React from 'react';
import { useIntl } from 'react-intl';
import { SelvstendigOgEllerFrilans } from '../../../types/SelvstendigOgEllerFrilansTypes';

interface Props {
    erSelvstendig: boolean;
    erFrilanser: boolean;
}

const insertIfSelvstendig = (erSelvstendig: boolean): SelvstendigOgEllerFrilans[] =>
    erSelvstendig ? [SelvstendigOgEllerFrilans.selvstendig] : [];

const insertIfFrilanser = (erFrilanser: boolean): SelvstendigOgEllerFrilans[] =>
    erFrilanser ? [SelvstendigOgEllerFrilans.frilans] : [];

const SelvstendigOgEllerFrilansSummaryView: React.FC<Props> = ({
    erSelvstendig,
    erFrilanser,
}: Props): JSX.Element | null => {
    const intl = useIntl();
    const erSelvstendigOgEllerFrilans = erSelvstendig || erFrilanser;

    const selvstendigOgEllerFrilansList = [...insertIfSelvstendig(erSelvstendig), ...insertIfFrilanser(erFrilanser)];

    return erSelvstendigOgEllerFrilans ? (
        <SummaryBlock header={intlHelper(intl, 'step.oppsummering.snF.spm')}>
            <SummaryList
                items={selvstendigOgEllerFrilansList}
                itemRenderer={(value): JSX.Element => (
                    <span>{intlHelper(intl, `step.oppsummering.snF.${value}.label`)}</span>
                )}
            />
        </SummaryBlock>
    ) : null;
};

export default SelvstendigOgEllerFrilansSummaryView;
