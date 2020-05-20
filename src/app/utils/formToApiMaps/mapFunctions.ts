import { Bekreftelser, FosterbarnApi } from '../../types/SøknadApiData';
import { YesOrNo } from 'common/types/YesOrNo';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';

export const mapToBekreftelser = (
    harForståttRettigheterOgPlikter: boolean,
    harBekreftetOpplysninger: boolean
): Bekreftelser => ({
    harBekreftetOpplysninger,
    harForståttRettigheterOgPlikter
});

export const settInnFosterbarn = (harFosterbarn: YesOrNo, listeAvFosterbarn: Fosterbarn[]): FosterbarnApi[] | null => {
    return harFosterbarn === YesOrNo.YES
        ? listeAvFosterbarn.map((fosterbarn: Fosterbarn) => {
              return {
                  fødselsnummer: fosterbarn.fødselsnummer,
                  fornavn: fosterbarn.fornavn || null,
                  etternavn: fosterbarn.etternavn || null
              };
          })
        : null;
};
export const yesOrNoToBoolean = (yesOrNo: YesOrNo): boolean => {
    switch (yesOrNo) {
        case YesOrNo.YES:
            return true;
        case YesOrNo.NO:
            return false;
        case YesOrNo.UNANSWERED:
            // TODO: Fix. Lignende mange andre steder. Må ha validering som en del av mapping
            return false;
        case YesOrNo.DO_NOT_KNOW:
            return false;
    }
};
