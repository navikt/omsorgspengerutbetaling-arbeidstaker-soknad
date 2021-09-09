import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import SøknadStep from '../SøknadStep';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';

const SmittevernDokumenterStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadStep
            id={StepID.DOKUMENTER_SMITTEVERNHENSYN}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={attachmentsSizeOver24Mb}>
            <>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_smittevernhensyn.info.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_smittevernhensyn.info.2" />
                    </Box>
                </CounsellorPanel>
                <Box margin={'l'}>
                    <PictureScanningGuide />
                </Box>
                <FormikVedleggsKomponent
                    uploadButtonLabel={intlHelper(intl, 'steg.vedlegg_smittevernhensyn.vedlegg')}
                    formikName={SøknadFormField.smittevernDokumenter}
                    dokumenter={values.smittevernDokumenter}
                    alleDokumenterISøknaden={alleDokumenterISøknaden}
                />
            </>
        </SøknadStep>
    );
};

export default SmittevernDokumenterStep;
