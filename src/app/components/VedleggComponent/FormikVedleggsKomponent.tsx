import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import Box from 'common/components/box/Box';
import FileUploadErrors from '../file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { Attachment } from 'common/types/Attachment';
import { useIntl } from 'react-intl';

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
