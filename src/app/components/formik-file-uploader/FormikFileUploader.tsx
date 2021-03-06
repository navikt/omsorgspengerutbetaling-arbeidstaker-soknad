import * as React from 'react';
import { FormikFileInput, FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { ArrayHelpers } from 'formik';
import { Attachment, PersistedFile } from 'common/types/Attachment';
import {
    attachmentShouldBeProcessed,
    attachmentShouldBeUploaded,
    attachmentUploadHasFailed,
    getPendingAttachmentFromFile,
    isFileObject,
    mapFileToPersistedFile,
    VALID_EXTENSIONS,
} from 'common/utils/attachmentUtils';
import { uploadFile } from '../../api/api';
import * as apiUtils from '../../utils/apiUtils';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';

export type FieldArrayReplaceFn = (index: number, value: any) => void;
export type FieldArrayPushFn = (obj: any) => void;
export type FieldArrayRemoveFn = (index: number) => undefined;

interface FormikFileUploader {
    name: string;
    label: string;
    validate?: FormikValidateFunction;
    onFileInputClick?: () => void;
    onErrorUploadingAttachments: (files: File[]) => void;
    onUnauthorizedOrForbiddenUpload: () => void;
    listOfAttachments: Attachment[];
}

type Props = FormikFileUploader;

const FormikFileUploader: React.FunctionComponent<Props> = ({
    name,
    onFileInputClick,
    onErrorUploadingAttachments,
    onUnauthorizedOrForbiddenUpload,
    listOfAttachments,
    ...otherProps
}: Props) => {
    const { logUserLoggedOut } = useAmplitudeInstance();

    function setAttachmentPendingToFalse(attachment: Attachment): Attachment {
        attachment.pending = false;
        return attachment;
    }

    function findAttachmentsToProcess(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeProcessed);
    }

    function findAttachmentsToUpload(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeUploaded);
    }

    function updateAttachmentListElement(
        attachments: Attachment[],
        attachment: Attachment,
        replaceFn: FieldArrayReplaceFn
    ) {
        replaceFn(attachments.indexOf(attachment), { ...attachment, file: mapFileToPersistedFile(attachment.file) });
    }

    function addPendingAttachmentToFieldArray(file: File, pushFn: FieldArrayPushFn): Attachment {
        const attachment = getPendingAttachmentFromFile(file);
        pushFn(attachment);
        return attachment;
    }

    function updateFailedAttachments(
        allAttachments: Attachment[],
        failedAttachments: Attachment[],
        replaceFn: FieldArrayReplaceFn
    ) {
        failedAttachments.forEach((attachment) => {
            attachment = setAttachmentPendingToFalse(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        });
        const failedFiles: File[] = failedAttachments
            .map(({ file }) => file)
            .filter((f: File | PersistedFile) => isFileObject(f)) as File[];

        onErrorUploadingAttachments(failedFiles);
    }

    async function uploadAttachment(attachment: Attachment): Promise<void> {
        const { file } = attachment;
        if (isFileObject(file)) {
            try {
                const response = await uploadFile(file);
                attachment = setAttachmentPendingToFalse(attachment);
                attachment.url = response.headers.location;
                attachment.uploaded = true;
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    await logUserLoggedOut('Ved opplasting av dokument');
                    onUnauthorizedOrForbiddenUpload();
                }
                setAttachmentPendingToFalse(attachment);
            }
        }
    }

    async function uploadAttachments(allAttachments: Attachment[], replaceFn: FieldArrayReplaceFn): Promise<void> {
        const attachmentsToProcess = findAttachmentsToProcess(allAttachments);
        const attachmentsToUpload = findAttachmentsToUpload(attachmentsToProcess);
        const attachmentsNotToUpload = attachmentsToProcess.filter((el) => !attachmentsToUpload.includes(el));

        for (const attachment of attachmentsToUpload) {
            await uploadAttachment(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        }

        const failedAttachments = [...attachmentsNotToUpload, ...attachmentsToUpload.filter(attachmentUploadHasFailed)];
        updateFailedAttachments(allAttachments, failedAttachments, replaceFn);
    }

    return (
        <FormikFileInput
            name={name}
            acceptedExtensions={VALID_EXTENSIONS.join(', ')}
            onFilesSelect={async (files: File[], { push, replace }: ArrayHelpers): Promise<void> => {
                const attachments = files.map((file) => addPendingAttachmentToFieldArray(file, push));
                await uploadAttachments([...listOfAttachments, ...attachments], replace);
            }}
            onClick={onFileInputClick}
            {...otherProps}
        />
    );
};

export default FormikFileUploader;
