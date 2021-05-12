import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import getLenker from '../../lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import SøknadStep from '../SøknadStep';

const SmittevernDokumenterStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const hasPendingUploads: boolean =
        (values.dokumenterSmittevernhensyn || []).find((a: any) => a.pending === true) !== undefined;
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadStep
            id={StepID.DOKUMENTER_SMITTEVERNHENSYN}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.2" />{' '}
                        <Lenke href={getLenker(intl.locale).veiledningEttersendelse} target="_blank">
                            <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.3" />
                        </Lenke>
                        <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.4" />
                    </Box>
                </CounsellorPanel>
            </FormBlock>

            <Box margin="l">
                <PictureScanningGuide />
            </Box>

            <FormBlock>
                <FormikVedleggsKomponent
                    uploadButtonLabel={intlHelper(intl, 'steg.dokumenter.smittevernVedlegg')}
                    formikName={SøknadFormField.dokumenterSmittevernhensyn}
                    dokumenter={values.dokumenterSmittevernhensyn}
                    alleDokumenterISøknaden={alleDokumenterISøknaden}
                />
            </FormBlock>
        </SøknadStep>
    );
};

export default SmittevernDokumenterStep;
