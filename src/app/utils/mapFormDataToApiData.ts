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
    FosterbarnApi,
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    YesNoSpørsmålOgSvar,
    YesNoSvar
} from '../types/SøknadApiData';
import {
    Arbeidsforhold,
    ArbeidsforholdField,
    HvorforSøkerDuDirekte,
    HvorforSøkerDuDirekteSubFields,
    SøknadFormData
} from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,
        hvorforSøkerDuDirekte,
        hvorforSøkerDuDirekteSubfields,
        hvorforSØkerDuDirekteAnnetBeskrivelse,
        arbeidsforhold,
        har_fosterbarn,
        fosterbarn,

        perioderMedFravær,
        dagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,
        
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd
    }: SøknadFormData,
    intl: IntlShape
): SøknadApiData => {
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
        spørsmål: settInnSpørsmål(hvorforSøkerDuDirekte, hvorforSøkerDuDirekteSubfields, intl),
        arbeidsgivere: settInnArbeidsgivere(arbeidsforhold),
        bekreftelser: settInnBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        fosterbarn: settInnFosterbarn(har_fosterbarn, fosterbarn)
    };

    return apiData;
};

function settInnBekreftelser(
    harForståttRettigheterOgPlikter: boolean,
    harBekreftetOpplysninger: boolean
): Bekreftelser {
    return {
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter
    };
}

function settInnFosterbarn(harFosterbarn: YesOrNo, listeAvFosterbarn: Fosterbarn[]): FosterbarnApi[] | null {
    return harFosterbarn === YesOrNo.YES
        ? listeAvFosterbarn.map((fosterbarn: Fosterbarn) => {
              return {
                  fødselsnummer: fosterbarn.fødselsnummer,
                  fornavn: fosterbarn.fornavn,
                  etternavn: fosterbarn.etternavn
              };
          })
        : null;
}

function settInnArbeidsgivere(listeAvArbeidsforhold: Arbeidsforhold[]): ArbeidsgiverDetaljer {
    return {
        organisasjoner: listeAvArbeidsforhold.map((arbeidsforhold: Arbeidsforhold) => {
            return {
                navn: arbeidsforhold.navn,
                organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
                harHattFraværHosArbeidsgiver:
                    arbeidsforhold[ArbeidsforholdField.harHattFraværHosArbeidsgiver] === YesOrNo.YES,
                arbeidsgiverHarUtbetaltLønn:
                    arbeidsforhold[ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES
            };
        })
    };
}

const settInnSpørsmål = (
    hvorforSøkerDuDirekte: HvorforSøkerDuDirekte,
    hvorforSøkerDuDirekteSubfields: HvorforSøkerDuDirekteSubFields,
    intl: IntlShape
): YesNoSpørsmålOgSvar[] => {
    return []; // TODO: Hvordan mappe fra radioboksen til YesNoSpørsmålOgSvar ? Burde kanskje endres i backend
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
