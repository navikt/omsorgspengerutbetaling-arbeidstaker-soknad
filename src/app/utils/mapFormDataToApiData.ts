import { IntlShape } from 'react-intl';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {
    ArbeidsgiverDetaljer,
    Bekreftelser,
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    YesNoSvar
} from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';

// TODO: FIX MAPPING!!!
export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Kvalifisering


        // STEG 2: Har betalt ut 10 første dager

        // STEG 3: Periode
        perioderMedFravær,
        dagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,

        // STEG 7: Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd

    }: SøknadFormData,
    intl: IntlShape
): SøknadApiData => {

    const settInnArbeidsgivere = (): ArbeidsgiverDetaljer => {
        return {
            organisasjoner: []
        };
    };

    const settInnBekreftelser = (): Bekreftelser => {
        return {
            harForståttRettigheterOgPlikter,
            harBekreftetOpplysninger
        };
    };

    // språk: Locale;
    // bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    // opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    // spørsmål: YesNoSpørsmålOgSvar[];
    // arbeidsgivere: ArbeidsgiverDetaljer;
    // bekreftelser: Bekreftelser;
    // utbetalingsperioder: UtbetalingsperiodeApi[]; // perioder
    // fosterbarn: FosterbarnApi[] | null;

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ), // medlemskap siden
        opphold: settInnOpphold(perioder_harVærtIUtlandet, perioder_utenlandsopphold, intl.locale), // periode siden, har du oppholdt
        spørsmål: [],
        arbeidsgivere: settInnArbeidsgivere(),
        bekreftelser: settInnBekreftelser(),
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        fosterbarn: [] // TODO: Fiks denne, og de andre over som er manglende
    };

    return apiData;
};

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): UtbetalingsperiodeApi[] => {
    const periodeMappedTilUtbetalingsperiode: UtbetalingsperiodeApi[] = perioderMedFravær.map(
        (periode: Periode): UtbetalingsperiodeApi => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom),
                tilOgMed: formatDateToApiFormat(periode.tom)
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: UtbetalingsperiodeApi[] = dagerMedDelvisFravær.map(
        (fravær: FraværDelerAvDag): UtbetalingsperiodeApi => {
            const duration: string = timeToIso8601Duration(decimalTimeToTime(fravær.timer));
            return {
                fraOgMed: formatDateToApiFormat(fravær.dato),
                tilOgMed: formatDateToApiFormat(fravær.dato),
                lengde: duration
            };
        }
    );

    return [...periodeMappedTilUtbetalingsperiode, ...fraværDeleravDagMappedTilUtbetalingsperiode];
};

export const mapYesOrNoToSvar = (input: YesOrNo): YesNoSvar => {
    return input === YesOrNo.YES;
};

const settInnBosteder = (
    harBoddUtenforNorgeSiste12Mnd: YesOrNo,
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo,
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[],
    locale: string
): UtenlandsoppholdApiData[] => {
    const mappedSiste12Mnd =
        harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
            ? utenlandsoppholdSiste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    const mappedNeste12Mnd =
        skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
            ? utenlandsoppholdNeste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    return [...mappedSiste12Mnd, ...mappedNeste12Mnd];
};

const settInnOpphold = (
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
