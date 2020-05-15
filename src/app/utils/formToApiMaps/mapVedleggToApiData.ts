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

export const filterArbeidsforholdMedVedlegg = (listeAvArbeidsforhold: ArbeidsforholdFormData[]) => {
    return listeAvArbeidsforhold.filter((arbeidsforhold: ArbeidsforholdFormData) =>
        skalInkludereVedleggFraArbeidsforhold(arbeidsforhold)
    );
};

export const collectAllAttachmentsAndMapToListOfString = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): string[] => {
    return filterArbeidsforholdMedVedlegg(listeAvArbeidsforhold)
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter]
                .map((attachment: Attachment) => {
                    return attachment.url;
                })
                .filter((maybeString: string | undefined) => {
                    // return notUndefined<string>(maybeString);
                    return notUndefined<string>(maybeString);
                }) as string[]; // TODO: Fix type
        })
        .flat();
};

export const listAlleVedlegg = (listeAvArbeidsforhold: ArbeidsforholdFormData[]): string[] => {
    return filterArbeidsforholdMedVedlegg(listeAvArbeidsforhold).map((arbeidsforhold: ArbeidsforholdFormData) => {
        return arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter].map((attachment: Attachment) => {
            return attachment.file.name; // TODO: Nullpointer hvis file plutselig er {} pga mellomlagring.
        })
    }).flat();
};
