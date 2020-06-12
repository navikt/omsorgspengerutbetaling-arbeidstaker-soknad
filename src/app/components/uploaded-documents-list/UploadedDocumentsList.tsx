import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../api/api';
import { SøknadFormData } from '../../types/SøknadFormData';

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
                onRemoveAttachmentClick={(attachment: Attachment): void => {
                    attachment.pending = true;
                    setFieldValue(formikFieldName, dokumenter);
                    attachment.url &&
                        deleteFile(attachment.url).then(
                            (): void => {
                                setFieldValue(formikFieldName, removeElementFromArray(attachment, dokumenter));
                            },
                            (): void => {
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
