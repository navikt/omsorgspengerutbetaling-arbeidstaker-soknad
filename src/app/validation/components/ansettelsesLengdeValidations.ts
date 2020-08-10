import {
    AnsettelseslengdeFormData,
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
} from '../../types/AnsettelseslengdeTypes';
import { Attachment } from 'common/types/Attachment';

export const ansettelsesLengdeIsValid = (
    ansettelsesLengde: AnsettelseslengdeFormData,
    dokumenter: Attachment[]
): boolean => {
    if (
        ansettelsesLengde[AnsettelseslengdeFormDataFields.hvorLengeJobbet] === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
        ansettelsesLengde[AnsettelseslengdeFormDataFields.begrunnelse] !== HvorLengeJobbetFordi.IKKE_BESVART &&
        ansettelsesLengde[AnsettelseslengdeFormDataFields.begrunnelse] !== HvorLengeJobbetFordi.INGEN
    ) {
        return true;
    }
    if (
        ansettelsesLengde[AnsettelseslengdeFormDataFields.hvorLengeJobbet] === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
        ansettelsesLengde[AnsettelseslengdeFormDataFields.begrunnelse] === HvorLengeJobbetFordi.INGEN &&
        ansettelsesLengde[AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring].length > 0
    ) {
        return true;
    }
    if (
        ansettelsesLengde[AnsettelseslengdeFormDataFields.hvorLengeJobbet] === HvorLengeJobbet.MER_ENN_FIRE_UKER &&
        dokumenter.length <= 3
    ) {
        return true;
    }
    return false;
};
