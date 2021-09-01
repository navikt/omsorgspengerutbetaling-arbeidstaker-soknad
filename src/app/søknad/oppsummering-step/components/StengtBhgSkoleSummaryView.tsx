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
import SummarySection from './summary-section/SummarySection';
interface Props {
    apiValues: SøknadApiData;
}

const StengtBhgSkoleSummaryView: React.FC<Props> = ({ apiValues }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = values[SøknadFormField.dokumenterStengtBkgSkole];

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.stengtBhgSkole.titel')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.stengtBhgSkole.spm')}>
                <JaNeiSvar harSvartJa={apiValues.hjemmePgaStengtBhgSkole} />

                {apiValues.hjemmePgaStengtBhgSkole && (
                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.stengtBhgSkole.bekreftelse.header')}>
                        {attachments.length > 0 ? (
                            <AttachmentList attachments={attachments} />
                        ) : (
                            <FormattedMessage
                                id="step.oppsummering.stengtBhgSkole.bekreftelse.ikkeLastetOpp"
                                tagName="em"
                            />
                        )}
                    </SummaryBlock>
                )}
            </SummaryBlock>
        </SummarySection>
    );
};

export default StengtBhgSkoleSummaryView;
