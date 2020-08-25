import { AnsettelseslengdeFormData, HvorLengeJobbet, HvorLengeJobbetFordi } from '../../types/AnsettelseslengdeTypes';
import { Attachment } from 'common/types/Attachment';
import { attachmentsAreValid } from '../fieldValidations';

export const ansettelsesLengdeIsValid = (
    ansettelsesLengde: AnsettelseslengdeFormData,
    dokumenter: Attachment[]
): boolean => {
    if (
        ansettelsesLengde.hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
        ansettelsesLengde.begrunnelse !== HvorLengeJobbetFordi.IKKE_BESVART &&
        ansettelsesLengde.begrunnelse !== HvorLengeJobbetFordi.INGEN
    ) {
        return true;
    }
    if (
        ansettelsesLengde.hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
        ansettelsesLengde.begrunnelse === HvorLengeJobbetFordi.INGEN &&
        ansettelsesLengde.ingenAvSituasjoneneForklaring.length > 0
    ) {
        return true;
    }

    if (ansettelsesLengde.hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && attachmentsAreValid(dokumenter)) {
        return true;
    }
    return false;
};
