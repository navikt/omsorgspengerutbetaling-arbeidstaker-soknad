import { YesOrNo } from 'common/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { mapBostedUtlandToApiData } from './mapBostedUtlandToApiData';

export const settInnOpphold = (
    periodeHarVærtIUtlandet: YesOrNo,
    periodeUtenlandsopphold: Utenlandsopphold[],
    locale: string
) => {
    return periodeHarVærtIUtlandet === YesOrNo.YES
        ? periodeUtenlandsopphold.map((utenlandsopphold: Utenlandsopphold) => {
            return mapBostedUtlandToApiData(utenlandsopphold, locale);
        })
        : [];
};