import { IntlShape } from 'react-intl';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from 'common/utils/timeUtils';
import { FraværDelerAvDag, Periode } from '../../@types/omsorgspengerutbetaling-schema';
import {
    Ansettelseslengde,
    ArbeidsgiverDetaljer,
    Begrunnelse,
    Bekreftelser,
    Bosted,
    FosterbarnApi,
    SøknadApiData,
    Utbetalingsperiode
} from '../types/SøknadApiData';
import {
    AnsettelseslengdeFormData,
    AnsettelseslengdeFormDataFields,
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    SøknadFormData
} from '../types/SøknadFormData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { Fosterbarn } from '@navikt/sif-common-forms/lib/fosterbarn';
import { Attachment } from 'common/types/Attachment';
import { notUndefined } from '../types/typeGuardUtilities';
import { logToSentryOrConsole } from './sentryUtils';
import { Severity } from '@sentry/types';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Situasjon
        arbeidsforhold,
        harAnnetArbeidsforhold,
        annetArbeidsforhold,

        harFosterbarn,
        fosterbarn,

        // STEG 2: Periode

        // STEG 3: ANNET
        perioder_harVærtIUtlandet,
        perioder_utenlandsopphold,
        har_søkt_andre_utbetalinger,
        andre_utbetalinger,

        // STEG 4: Medlemskap
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
        ),
        opphold: settInnOpphold(perioder_harVærtIUtlandet, perioder_utenlandsopphold, intl.locale), // periode siden, har du oppholdt
        arbeidsgivere: mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer(arbeidsforhold),
        bekreftelser: settInnBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        andreUtbetalinger: har_søkt_andre_utbetalinger === YesOrNo.YES ? [...andre_utbetalinger] : [],
        fosterbarn: settInnFosterbarn(harFosterbarn, fosterbarn),
        vedlegg: collectAllAttachmentsAndMapToListOfString(arbeidsforhold)
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

export const mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsgiverDetaljer[] => {
    return listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) => {
        return {
            navn: arbeidsforhold[ArbeidsforholdFormDataFields.navn],
            organisasjonsnummer: arbeidsforhold[ArbeidsforholdFormDataFields.organisasjonsnummer],
            harHattFraværHosArbeidsgiver: yesOrNoToBoolean(
                arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver]
            ),
            arbeidsgiverHarUtbetaltLønn: yesOrNoToBoolean(
                arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn]
            ),
            ansettelseslengde: mapAnsettelseslengde(arbeidsforhold[ArbeidsforholdFormDataFields.ansettelseslengde]),
            perioder: mapPeriodeTilUtbetalingsperiode(
                arbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær],
                arbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
            )
        };
    });
};

export const mapAnsettelseslengde = (ansettelseslengdeFormData: AnsettelseslengdeFormData): Ansettelseslengde => {
    // TODO: Legg til validering (f eks merEnn4Uker -> begrunnelse === null
    return {
        merEnn4Uker: mapHvorLengeJobbetToBoolean(
            ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.hvorLengeJobbet]
        ),
        begrunnelse: hvorLengeJobbetFordiToBegrunnelse(
            ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.begrunnelse]
        ),
        ingenAvSituasjoneneForklaring:
            ansettelseslengdeFormData[AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]
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
                Severity.Error
            );
            return false;
        }
        default: {
            logToSentryOrConsole(
                `Mapping Error in mapHvorLengeJobbetToBoolean. Case: Default. Det skal ikke være mulig å oppnå Default`,
                Severity.Error
            );
            return false;
        }
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

export const yesOrNoToBoolean = (yesOrNo: YesOrNo) => {
    switch (yesOrNo) {
        case YesOrNo.YES:
            return true;
        case YesOrNo.NO:
            return false;
        case YesOrNo.UNANSWERED:
            return false;
        case YesOrNo.DO_NOT_KNOW:
            return false;
    }
};

export const mapPeriodeTilUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): Utbetalingsperiode[] => {
    const periodeMappedTilUtbetalingsperiode: Utbetalingsperiode[] = perioderMedFravær.map(
        (periode: Periode): Utbetalingsperiode => {
            return {
                fraOgMed: formatDateToApiFormat(periode.fom),
                tilOgMed: formatDateToApiFormat(periode.tom),
                lengde: null
            };
        }
    );

    const fraværDeleravDagMappedTilUtbetalingsperiode: Utbetalingsperiode[] = dagerMedDelvisFravær.map(
        (fravær: FraværDelerAvDag): Utbetalingsperiode => {
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

const settInnBosteder = (
    harBoddUtenforNorgeSiste12Mnd: YesOrNo,
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo,
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[],
    locale: string
): Bosted[] => {
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

export const collectAllAttachmentsAndMapToListOfString = (
    listeAvArbeidsforhold: ArbeidsforholdFormData[]
): string[] => {
    return listeAvArbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter]
                .map((attachment: Attachment) => {
                    return attachment.url;
                })
                .filter((maybeString: string | undefined) => {
                    return notUndefined<string>(maybeString);
                }) as string[]; // TODO: Fix type
        })
        .flat();
};
