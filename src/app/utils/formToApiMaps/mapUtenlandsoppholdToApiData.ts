import { YesOrNo } from 'common/types/YesOrNo';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { mapBostedUtlandToApiData } from './mapBostedUtlandToApiData';
import { Bosted } from '../../types/SøknadApiData';

export const settInnOpphold = (
    periodeHarVærtIUtlandet: YesOrNo,
    periodeUtenlandsopphold: Utenlandsopphold[],
    locale: string
): Bosted[] => {
    return periodeHarVærtIUtlandet === YesOrNo.YES
        ? periodeUtenlandsopphold.map((utenlandsopphold: Utenlandsopphold) => {
              return mapBostedUtlandToApiData(utenlandsopphold, locale);
          })
        : [];
};
