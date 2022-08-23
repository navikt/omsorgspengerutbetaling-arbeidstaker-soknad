import { YesOrNo } from 'common/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import { evaluatePrevAndCurrent } from '../validationUtils';
import { SøknadFormData } from '../../types/SøknadFormData';

export const utenlandsoppholdIsValid = (utelandsopphold: Utenlandsopphold): boolean => {
    if (utelandsopphold.landkode && dayjs(utelandsopphold.fom).isValid() && dayjs(utelandsopphold.tom).isValid()) {
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

export const utenlandsoppholdFormIsValid = ({
    perioderHarVærtIUtlandet,
    perioderUtenlandsopphold,
}: SøknadFormData): boolean => {
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
