import { YesOrNo } from 'common/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { evaluatePrevAndCurrent } from './arbeidsforholdValidations';
import { isDate } from 'moment';

export const utenlandsoppholdIsValid = (utelandsopphold: Utenlandsopphold): boolean => {
    if (utelandsopphold.landkode && isDate(utelandsopphold.fom) && isDate(utelandsopphold.tom)) {
        return true;
    } else {
        return false;
    }
};

export const listeAvUtenlandsoppholdIsValid = (listeAvUtenlandsopphold: Utenlandsopphold[]): boolean => {
    return listeAvUtenlandsopphold
        .map((utenlandsopphold: Utenlandsopphold) => {
            return utenlandsoppholdIsValid(utenlandsopphold);
        })
        .reduceRight(evaluatePrevAndCurrent, true);
};

export const utenlandsoppholdFormIsValid = (
    perioderHarVærtIUtlandet: YesOrNo,
    perioderUtenlandsopphold: Utenlandsopphold[]
): boolean => {
    if (
        perioderHarVærtIUtlandet === YesOrNo.NO ||
        (perioderHarVærtIUtlandet === YesOrNo.YES &&
            perioderUtenlandsopphold.length > 0 &&
            listeAvUtenlandsoppholdIsValid(perioderUtenlandsopphold))
    ) {
        return true;
    } else {
        return false;
    }
};
