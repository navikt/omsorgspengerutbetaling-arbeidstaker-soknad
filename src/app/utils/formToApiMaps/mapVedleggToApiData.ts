import { Attachment } from 'common/types/Attachment';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { AnsettelseslengdeFormDataFields, HvorLengeJobbet } from '../../types/AnsettelseslengdeTypes';

const skalInkludereVedleggFraArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    if (
        arbeidsforhold[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.hvorLengeJobbet
        ] === HvorLengeJobbet.MER_ENN_FIRE_UKER
    ) {
        return true;
    } else {
        return false;
    }
};

export const filterArbeidsforholdMedVedlegg = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsforholdFormData[] => {
    return listeAvArbeidsforhold.filter((arbeidsforhold: ArbeidsforholdFormData) =>
        skalInkludereVedleggFraArbeidsforhold(arbeidsforhold)
    );
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export const listOfAttachmentsToListOfUrlStrings = (attachments: Attachment[]): string[] => {
    return attachments
        .map((attachment: Attachment) => {
            return attachment.url;
        })
        .filter(notEmpty);
};

export const listOfAttachmentsToListOfDocumentName = (attachments: Attachment[]): string[] => {
    return attachments
        .filter((attachment: Attachment) => notEmpty(attachment.url))
        .map((attachment: Attachment) => {
            return attachment.file.name;
        });
};

export const listOfArbeidsforholdFormDataToListOfAttachmentStrings = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): string[] => {
    return filterArbeidsforholdMedVedlegg(listeAvArbeidsforhold)
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return listOfAttachmentsToListOfUrlStrings(arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter]);
        })
        .flat();
};

export const listAlleVedleggFraArbeidsforhold = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): string[] => {
    return filterArbeidsforholdMedVedlegg(listeAvArbeidsforhold)
        .map((arbeidsforhold: ArbeidsforholdFormData) =>
            listOfAttachmentsToListOfDocumentName(arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter])
        )
        .flat();
};
