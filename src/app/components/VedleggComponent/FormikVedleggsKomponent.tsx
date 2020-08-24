import * as React from 'react';
import Box from 'common/components/box/Box';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormBlock from 'common/components/form-block/FormBlock';
import { Attachment } from 'common/types/Attachment';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

interface Props {
    uploadButtonLabel: string;
    formikName: string;
    dokumenter: Attachment[];
}

const FormikVedleggsKomponent: React.FC<Props> = ({ formikName, dokumenter, uploadButtonLabel }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const totalSize = getTotalSizeOfAttachments(dokumenter);

    return (
        <div>
            <FormBlock>
                <FormikFileUploader
                    name={formikName}
                    label={uploadButtonLabel}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={(): void => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    onUnauthorizedOrForbiddenUpload={(): void => navigateToLoginPage()}
                    validate={validateDocuments}
                    listOfAttachments={dokumenter}
                />
            </FormBlock>
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse'} />
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="m">
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <Box margin="l">
                <UploadedDocumentsList
                    attachments={dokumenter}
                    formikFieldName={formikName}
                    wrapNoAttachmentsInBox={true}
                    includeDeletionFunctionality={true}
                />
            </Box>
        </div>
    );
};

export default FormikVedleggsKomponent;
