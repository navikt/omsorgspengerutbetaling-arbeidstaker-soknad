import * as React from 'react';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';

const SmittevernDokumenterSummaryView: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = values[SøknadFormField.smittevernDokumenter].filter(
        (attachment) => attachment.uploaded === true && attachment.url
    );
    return (
        <SummaryBlock header={intlHelper(intl, 'step.oppsummering.smittevern.bekreftelse.header')}>
            {attachments.length > 0 ? (
                <AttachmentList attachments={attachments} />
            ) : (
                <FormattedMessage id="step.oppsummering.smittevern.bekreftelse.ikkeLastetOpp" tagName="em" />
            )}
        </SummaryBlock>
    );
};

export default SmittevernDokumenterSummaryView;
