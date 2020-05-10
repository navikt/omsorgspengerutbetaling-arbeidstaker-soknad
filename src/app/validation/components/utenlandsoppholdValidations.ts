import { YesOrNo } from 'common/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';

export const listeAvUtenlandsoppholdIsValid = (listeAvPerioder: Utenlandsopphold[]): boolean => {
    // TODO: Finn validation function i sif-common-forms
    return true;
};


export const utenlandsoppholdIsValid = (
    perioderHarVærtIUtlandet: YesOrNo,
    perioderUtenlandsopphold: Utenlandsopphold[]
): boolean => {
    if (
        perioderHarVærtIUtlandet === YesOrNo.NO ||
        (
            perioderHarVærtIUtlandet === YesOrNo.YES &&
            listeAvUtenlandsoppholdIsValid(perioderUtenlandsopphold)
        )
    ) {
        return true;
    } else {
        return false;
    }
};
