import * as React from 'react';
import intlHelper from 'common/utils/intlUtils';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';

interface Props {
    apiValues: SøknadApiData;
}

const SmittevernSummaryView: React.FC<Props> = ({ apiValues }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = values[SøknadFormField.smittevernDokumenter];

    return (
        <SummaryBlock header={intlHelper(intl, 'steg.en.smittevern.sporsmal')}>
            <JaNeiSvar harSvartJa={apiValues.hjemmePgaSmittevernhensyn} />

            {apiValues.hjemmePgaSmittevernhensyn && (
                <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.smittevern.bekreftelse.header')}>
                    {attachments.length > 0 ? (
                        <AttachmentList attachments={attachments} />
                    ) : (
                        <FormattedMessage id="steg.oppsummering.smittevern.bekreftelse.ikkeLastetOpp" tagName="em" />
                    )}
                </SummaryBlock>
            )}
        </SummaryBlock>
    );
};

export default SmittevernSummaryView;
