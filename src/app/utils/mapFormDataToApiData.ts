import { IntlShape } from 'react-intl';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {
    ArbeidsgiverDetaljer,
    Begrunnelse,
    Bekreftelser,
    FosterbarnApi,
    JobbHosNåværendeArbeidsgiver,
    SøknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    YesNoSvar
} from '../types/SøknadApiData';
import {
    Arbeidsforhold,
    ArbeidsforholdField,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    SøknadFormData
} from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';
import { attachmentUploadHasFailed } from 'common/utils/attachmentUtils';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        hvorLengeHarDuJobbetHosNåværendeArbeidsgiver,
        hvorLengeJobbetFordi,

        dokumenter,

        arbeidsforhold,
        har_fosterbarn,
        fosterbarn,

        perioderMedFravær,
        dagerMedDelvisFravær,
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,

        har_søkt_andre_utbetalinger,
        andre_utbetalinger,

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
        jobbHosNåværendeArbeidsgiver: settInnJobbHosNåværendeArbeidsgiver(
            hvorLengeHarDuJobbetHosNåværendeArbeidsgiver,
            hvorLengeJobbetFordi
        ),
        vedlegg:
            hvorLengeHarDuJobbetHosNåværendeArbeidsgiver === HvorLengeJobbet.MER_ENN_FIRE_UKER
                ? dokumenter.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
                : [],
        spørsmål: [],
        arbeidsgivere: settInnArbeidsgivere(arbeidsforhold),
        bekreftelser: settInnBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        utbetalingsperioder: mapPeriodeTilUtbetalingsperiode(perioderMedFravær, dagerMedDelvisFravær),
        andreUtbetalinger: har_søkt_andre_utbetalinger === YesOrNo.YES ? [...andre_utbetalinger] : [],
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

const settInnBegrunnelse = (verdi: HvorLengeJobbetFordi): Begrunnelse | null => {
    switch (verdi) {
        case HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD:
            return Begrunnelse.ANNET_ARBEIDSFORHOLD;
        case HvorLengeJobbetFordi.ANDRE_YTELSER:
            return Begrunnelse.ANDRE_YTELSER;
        case HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON:
            return Begrunnelse.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON;
        case HvorLengeJobbetFordi.MILITÆRTJENESTE:
            return Begrunnelse.MILITÆRTJENESTE;
        case HvorLengeJobbetFordi.INGEN:
            return null; // TODO: Oppdater ihht skisser
        default:
            return null;
    }
};

const settInnJobbHosNåværendeArbeidsgiver = (
    hvorLengeHarDuJobbetHosNåværendeArbeidsgiver: HvorLengeJobbet,
    hvorLengeJobbetFordi: HvorLengeJobbetFordi
): JobbHosNåværendeArbeidsgiver => {
    return {
        merEnn4Uker: hvorLengeHarDuJobbetHosNåværendeArbeidsgiver === HvorLengeJobbet.MER_ENN_FIRE_UKER,
        begrunnelse:
            hvorLengeHarDuJobbetHosNåværendeArbeidsgiver === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
                ? settInnBegrunnelse(hvorLengeJobbetFordi)
                : null
    };
};

function settInnFosterbarn(harFosterbarn: YesOrNo, listeAvFosterbarn: Fosterbarn[]): FosterbarnApi[] | null {
    return harFosterbarn === YesOrNo.YES
        ? listeAvFosterbarn.map((fosterbarn: Fosterbarn) => {
              return {
                  fødselsnummer: fosterbarn.fødselsnummer,
                  fornavn: fosterbarn.fornavn || null,
                  etternavn: fosterbarn.etternavn || null
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
