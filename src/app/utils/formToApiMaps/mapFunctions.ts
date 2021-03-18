import { Bekreftelser } from '../../types/SøknadApiData';
import { YesOrNo } from 'common/types/YesOrNo';

export const mapToBekreftelser = (
    harForståttRettigheterOgPlikter: boolean,
    harBekreftetOpplysninger: boolean
): Bekreftelser => ({
    harBekreftetOpplysninger,
    harForståttRettigheterOgPlikter,
});

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
