import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import intlHelper from 'common/utils/intlUtils';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import { ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import Box from 'common/components/box/Box';
import FileUploadErrors from '../file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { Attachment } from 'common/types/Attachment';
import { useIntl } from 'react-intl';

interface Props {
    nameDokumenter: string;
    dokumenter: Attachment[];
}

const VedleggComponent: React.FC<Props> = ({nameDokumenter, dokumenter}: Props) => {

    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();

    return (
        <div>
            <FormBlock>
                <FormikFileUploader
                    name={nameDokumenter}
                    label={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
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
                    formikFieldName={nameDokumenter}
                    wrapNoAttachmentsInBox={true}
                    includeDeletionFunctionality={true}
                />
            </Box>
        </div>
    )
};

export default VedleggComponent;