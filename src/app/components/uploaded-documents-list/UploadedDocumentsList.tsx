import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../api/api';
import { ArbeidsforholdFormData, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';

interface Props {
    attachments: Attachment[];
    formikFieldName: string;
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedDocumentsList: React.FunctionComponent<Props> = ({
    attachments,
    formikFieldName,
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const dokumenter: Attachment[] = attachments.filter(({ file }: Attachment) => {
        return file && file.name ? fileExtensionIsValid(file.name) : false;
    });

    if (dokumenter && !containsAnyUploadedAttachments(dokumenter)) {
        return null;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={dokumenter}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(formikFieldName, dokumenter);
                    deleteFile(attachment.url!).then(
                        () => {
                            setFieldValue(formikFieldName, removeElementFromArray(attachment, dokumenter));
                        },
                        () => {
                            setFieldValue(formikFieldName, removeElementFromArray(attachment, dokumenter));
                        }
                    );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={dokumenter} />;
    }
};

export default UploadedDocumentsList;
