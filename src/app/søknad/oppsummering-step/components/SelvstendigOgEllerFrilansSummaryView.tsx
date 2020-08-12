import SummaryBlock from './SummaryBlock';
import intlHelper from 'common/utils/intlUtils';
import SummaryList from 'common/components/summary-list/SummaryList';
import React from 'react';
import { useIntl } from 'react-intl';

interface Props {
    selvstendigOgEllerFrilans: string[];
}

const SelvstendigOgEllerFrilansSummaryView: React.FC<Props> = ({ selvstendigOgEllerFrilans }: Props): JSX.Element => {
    const intl = useIntl();
    return (
        <>
            {selvstendigOgEllerFrilans.length > 0 && (
                <SummaryBlock header={intlHelper(intl, 'selvstendig_og_eller_frilans.ja_nei.spm')}>
                    <SummaryList
                        items={selvstendigOgEllerFrilans}
                        itemRenderer={(utbetaling): JSX.Element => (
                            <span>{intlHelper(intl, `selvstendig_og_eller_frilans.${utbetaling}.label`)}</span>
                        )}
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default SelvstendigOgEllerFrilansSummaryView;
