import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from './SummaryBlock';

interface Props {
    dokumenterStengBhgSkole: Attachment[];
}

const StengtBhgSkoleSummaryView: React.FC<Props> = ({ dokumenterStengBhgSkole }) => {
    const intl = useIntl();
    return (
        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.stengtBhgSkole.bekreftelse.header')}>
            {dokumenterStengBhgSkole.length > 0 ? (
                <AttachmentList attachments={dokumenterStengBhgSkole} />
            ) : (
                <FormattedMessage id="steg.oppsummering.stengtBhgSkole.bekreftelse.ikkeLastetOpp" tagName="em" />
            )}
        </SummaryBlock>
    );
};

export default StengtBhgSkoleSummaryView;
