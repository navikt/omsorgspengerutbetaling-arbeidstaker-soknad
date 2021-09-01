import * as React from 'react';
import Box from 'common/components/box/Box';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormBlock from 'common/components/form-block/FormBlock';
import { Attachment } from 'common/types/Attachment';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { alleDokumenterISøknadenToFieldValidationResult } from '../../validation/fieldValidations';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';

interface Props {
    uploadButtonLabel: string;
    formikName: string;
    dokumenter: Attachment[];
    alleDokumenterISøknaden: Attachment[];
}

const FormikVedleggsKomponent: React.FC<Props> = ({
    formikName,
    dokumenter,
    alleDokumenterISøknaden,
    uploadButtonLabel,
}: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);

    return (
        <div>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    <FormikFileUploader
                        name={formikName}
                        label={uploadButtonLabel}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
                        validate={() => alleDokumenterISøknadenToFieldValidationResult(alleDokumenterISøknaden)}
                        listOfAttachments={dokumenter}
                    />
                </FormBlock>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'formikVedleggsKomponent.advarsel.totalstørrelse.1'} />
                        <Lenke
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={
                                'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse'
                            }>
                            <FormattedMessage id={'formikVedleggsKomponent.advarsel.totalstørrelse.2'} />
                        </Lenke>
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
