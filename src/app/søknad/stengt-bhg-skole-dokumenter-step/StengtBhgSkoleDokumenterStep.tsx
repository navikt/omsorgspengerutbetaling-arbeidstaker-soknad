import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import SøknadStep from '../SøknadStep';

const StengtBhgSkoleDokumenterStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const hasPendingUploads: boolean =
        (values.dokumenterStengtBkgSkole || []).find((a: any) => a.pending === true) !== undefined;
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadStep
            id={StepID.DOKUMENTER_STENGT_SKOLE_BHG}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <CounsellorPanel>
                <Box padBottom={'l'}>
                    <FormattedMessage id="steg.annet.stengtBhgSkole.info.1" />
                </Box>
                <Box padBottom={'l'}>
                    <FormattedMessage id="steg.annet.stengtBhgSkole.info.2" />
                </Box>
            </CounsellorPanel>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            <FormikVedleggsKomponent
                uploadButtonLabel={intlHelper(intl, 'steg.annet.stengtBhgSkole.vedlegg')}
                formikName={SøknadFormField.dokumenterStengtBkgSkole}
                dokumenter={values.dokumenterStengtBkgSkole}
                alleDokumenterISøknaden={alleDokumenterISøknaden}
            />
        </SøknadStep>
    );
};

export default StengtBhgSkoleDokumenterStep;
