import { Attachment } from 'common/types/Attachment';
import { notUndefined } from '../../types/typeGuardUtilities';
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

export const collectAllAttachmentsAndMapToListOfString = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): string[] => {
    return listeAvArbeidsforhold
        .filter((arbeidsforhold: ArbeidsforholdFormData) => {
            return skalInkludereVedleggFraArbeidsforhold(arbeidsforhold);
        })
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter]
                .map((attachment: Attachment) => {
                    return attachment.url;
                })
                .filter((maybeString: string | undefined) => {
                    return notUndefined<string>(maybeString);
                }) as string[]; // TODO: Fix type
        })
        .flat();
};
