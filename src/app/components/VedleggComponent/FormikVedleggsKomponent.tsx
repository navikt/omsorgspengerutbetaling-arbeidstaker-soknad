import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormBlock from 'common/components/form-block/FormBlock';
import { Attachment } from 'common/types/Attachment';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';

interface Props {
    uploadButtonLabel: string;
    formikName: string;
    dokumenter: Attachment[];
}

const FormikVedleggsKomponent: React.FC<Props> = ({ formikName, dokumenter, uploadButtonLabel }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();

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
