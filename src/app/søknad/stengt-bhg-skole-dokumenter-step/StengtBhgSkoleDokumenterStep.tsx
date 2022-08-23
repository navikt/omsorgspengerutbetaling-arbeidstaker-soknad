import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const StengtBhgSkoleDokumenterStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const hasPendingUploads: boolean =
        (values.dokumenterStengtBkgSkole || []).find((a: any) => a.pending === true) !== undefined;

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.DOKUMENTER_STENGT_SKOLE_BHG}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <>
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="steg.vedlegg_stengtSkoleBhg.info.2" />
                    </Box>
                </CounsellorPanel>
                <Box margin={'l'}>
                    <PictureScanningGuide />
                </Box>
                <FormikVedleggsKomponent
                    uploadButtonLabel={intlHelper(intl, 'steg.vedlegg_stengtSkoleBhg.vedlegg')}
                    formikName={SøknadFormField.dokumenterStengtBkgSkole}
                    dokumenter={values.dokumenterStengtBkgSkole}
                    alleDokumenterISøknaden={alleDokumenterISøknaden}
                />
            </>
        </SoknadFormStep>
    );
};

export default StengtBhgSkoleDokumenterStep;
