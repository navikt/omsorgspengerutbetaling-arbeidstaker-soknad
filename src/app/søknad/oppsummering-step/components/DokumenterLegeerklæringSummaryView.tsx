import * as React from 'react';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

const DokumenterLegeerklæringSummaryView: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = values[SøknadFormField.dokumenterLegeerklæring];

    return (
        <Box margin="s">
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenterLegeerklæring.header')}>
                {attachments.length === 0 && (
                    <FormattedMessage id={'steg.oppsummering.dokumenterLegeerklæring.ikkeLastetOpp'} tagName="em" />
                )}
                {attachments.length > 0 && <AttachmentList attachments={attachments} />}
            </SummaryBlock>
        </Box>
    );
};

export default DokumenterLegeerklæringSummaryView;
