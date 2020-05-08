import { Ansettelseslengde, Begrunnelse } from '../../types/SøknadApiData';
import { logToSentryOrConsole } from '../sentryUtils';
import { Severity } from '@sentry/types';
import {
    AnsettelseslengdeFormData,
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi
} from '../../types/AnsettelseslengdeTypes';

export const forklaringEllerNull = (ansettelseslengdeFormData: AnsettelseslengdeFormData): string | null => {
    if (
        ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.hvorLengeJobbet] ===
            HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
        ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.begrunnelse] === HvorLengeJobbetFordi.INGEN
    ) {
        return ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring];
    } else {
        return null;
    }
};

export const mapAnsettelseslengde = (ansettelseslengdeFormData: AnsettelseslengdeFormData): Ansettelseslengde => {
    return {
        merEnn4Uker: mapHvorLengeJobbetToBoolean(
            ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.hvorLengeJobbet]
        ),
        begrunnelse: hvorLengeJobbetFordiToBegrunnelseEllerNull(ansettelseslengdeFormData),
        ingenAvSituasjoneneForklaring: forklaringEllerNull(ansettelseslengdeFormData)
    };
};
export const mapHvorLengeJobbetToBoolean = (hvorLengeJobbet: HvorLengeJobbet): boolean => {
    switch (hvorLengeJobbet) {
        case HvorLengeJobbet.MINDRE_ENN_FIRE_UKER:
            return false;
        case HvorLengeJobbet.MER_ENN_FIRE_UKER:
            return true;
        case HvorLengeJobbet.IKKE_BESVART: {
            logToSentryOrConsole(
                `Mapping Error in mapHvorLengeJobbetToBoolean. Case: ${HvorLengeJobbet.IKKE_BESVART}. Det skal ikke være mulig å komme til oppsummeringssiden uten å ha valgt enten mer eller mindre enn fire uker`,
                Severity.Critical
            );
            return false;
        }
        default: {
            logToSentryOrConsole(
                `Mapping Error in mapHvorLengeJobbetToBoolean. Case: Default. Det skal ikke være mulig å oppnå Default`,
                Severity.Critical
            );
            return false;
        }
    }
};

export const hvorLengeJobbetFordiToBegrunnelseEllerNull = (ansettelseslengdeFormData: AnsettelseslengdeFormData) => {
    if (
        ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.hvorLengeJobbet] ===
        HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
    ) {
        return hvorLengeJobbetFordiToBegrunnelse(
            ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.begrunnelse]
        );
    } else {
        return null;
    }
};

export const hvorLengeJobbetFordiToBegrunnelse = (hvorLengeJobbetFordi: HvorLengeJobbetFordi): Begrunnelse | null => {
    switch (hvorLengeJobbetFordi) {
        case HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD:
            return Begrunnelse.ANNET_ARBEIDSFORHOLD;
        case HvorLengeJobbetFordi.ANDRE_YTELSER:
            return Begrunnelse.ANDRE_YTELSER;
        case HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON:
            return Begrunnelse.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON;
        case HvorLengeJobbetFordi.MILITÆRTJENESTE:
            return Begrunnelse.MILITÆRTJENESTE;
        case HvorLengeJobbetFordi.INGEN:
            return Begrunnelse.INGEN_AV_SITUASJONENE;
        default: {
            return null;
        }
    }
};

export const begrunnelseTilHvorLengeJobbetFordi = (begrunnelse: Begrunnelse): HvorLengeJobbetFordi => {
    switch (begrunnelse) {
        case Begrunnelse.ANNET_ARBEIDSFORHOLD: {
            return HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD;
        }
        case Begrunnelse.ANDRE_YTELSER: {
            return HvorLengeJobbetFordi.ANDRE_YTELSER;
        }
        case Begrunnelse.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON: {
            return HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON;
        }
        case Begrunnelse.MILITÆRTJENESTE: {
            return HvorLengeJobbetFordi.MILITÆRTJENESTE;
        }
        case Begrunnelse.INGEN_AV_SITUASJONENE: {
            return HvorLengeJobbetFordi.INGEN;
        }
    }
};
