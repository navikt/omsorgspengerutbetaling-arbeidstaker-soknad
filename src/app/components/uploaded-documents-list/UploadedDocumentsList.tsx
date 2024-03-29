import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import api from '../../api/api';
import { SøknadFormData } from '../../types/SøknadFormData';

interface Props {
    attachments: Attachment[];
    formikFieldName: string;
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedDocumentsList: React.FC<Props> = ({ attachments, formikFieldName, includeDeletionFunctionality }) => {
    const { setFieldValue } = useFormikContext<SøknadFormData>();

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
                    attachment.url &&
                        api.deleteFile(attachment.url).then(
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
