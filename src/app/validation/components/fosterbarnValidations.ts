import { YesOrNo } from 'common/types/YesOrNo';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';
import { fødselsnummerIsValid } from 'common/validation/fødselsnummerValidator';

export const fosterbarnIsValid = (fosterbarn: Fosterbarn): boolean => {
    const [isValid] = fødselsnummerIsValid(fosterbarn.fødselsnummer);
    return isValid;
};

export const listeAvFosterbarnIsValid = (listeAvFosterbard: Fosterbarn[]): boolean => {
    const isValid: boolean = listeAvFosterbard
        .map((fosterbarn: Fosterbarn) => {
            return fosterbarnIsValid(fosterbarn);
        })
        .reduceRight((prev, curr) => {
            if (prev === false) {
                return prev;
            } else {
                return curr;
            }
        }, true);
    return isValid;
};

export const harFosterbarnOgListeAvFosterbarnIsValid = (
    harFosterbarn: YesOrNo,
    listeAvFosterbarn: Fosterbarn[]
): boolean => {
    if (
        harFosterbarn === YesOrNo.NO ||
        (harFosterbarn === YesOrNo.YES && listeAvFosterbarnIsValid(listeAvFosterbarn))
    ) {
        return true;
    } else {
        return false;
    }
};
