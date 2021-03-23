import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from './SummaryBlock';

interface Props {
    dokumenterSmittevern: Attachment[];
}

const SmittevernSummaryView: React.FC<Props> = ({ dokumenterSmittevern }) => {
    const intl = useIntl();
    return (
        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.smittevern.bekreftelse.header')}>
            {dokumenterSmittevern.length > 0 ? (
                <AttachmentList attachments={dokumenterSmittevern} />
            ) : (
                <FormattedMessage id="steg.oppsummering.smittevern.bekreftelse.ikkeLastetOpp" tagName="em" />
            )}
        </SummaryBlock>
    );
};

export default SmittevernSummaryView;
