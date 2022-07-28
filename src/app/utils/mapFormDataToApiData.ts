import { SøknadApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { IntlShape } from 'react-intl';
import { Locale } from 'common/types/Locale';
import { settInnBosteder } from './formToApiMaps/mapBostedUtlandToApiData';
import { settInnOpphold } from './formToApiMaps/mapUtenlandsoppholdToApiData';
import {
    listOfArbeidsforholdFormDataToListOfAttachmentStrings,
    listOfAttachmentsToListOfUrlStrings,
} from './formToApiMaps/mapVedleggToApiData';
import { mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer } from './formToApiMaps/mapArbeidsforholdToApiData';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { getAlleUtbetalingsperioder } from './arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from './periodeUtils';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Situasjon
        // STEG 2: Periode
        arbeidsforhold,
        perioderHarVærtIUtlandet,
        perioderUtenlandsopphold,

        // Dokumenter
        smittevernDokumenter,
        dokumenterStengtBkgSkole,

        // STEG 4: Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
    }: SøknadFormData,
    intl: IntlShape
): SøknadApiData => {
    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(arbeidsforhold);

    const _vedleggSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder)
        ? listOfAttachmentsToListOfUrlStrings(smittevernDokumenter)
        : [];

    const _vedleggStengtBhgSkole =
        isFeatureEnabled(Feature.STENGT_BHG_SKOLE) && harFraværPgaStengBhgSkole(alleUtbetalingsperioder)
            ? listOfAttachmentsToListOfUrlStrings(dokumenterStengtBkgSkole)
            : [];

    const apiData: SøknadApiData = {
        språk: (intl.locale as any) === 'en' ? 'nn' : (intl.locale as Locale),
        bosteder: settInnBosteder(
            harBoddUtenforNorgeSiste12Mnd,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            utenlandsoppholdNeste12Mnd,
            intl.locale
        ),
        opphold: settInnOpphold(perioderHarVærtIUtlandet, perioderUtenlandsopphold, intl.locale), // periode siden, har du oppholdt
        arbeidsgivere: mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer([...arbeidsforhold]),
        bekreftelser: {
            harForståttRettigheterOgPlikter: harForståttRettigheterOgPlikter,
            harBekreftetOpplysninger: harBekreftetOpplysninger,
        },
        vedlegg: [
            ...listOfArbeidsforholdFormDataToListOfAttachmentStrings([...arbeidsforhold]),
            ..._vedleggSmittevern,
            ..._vedleggStengtBhgSkole,
        ],
        _vedleggSmittevern,
        _vedleggStengtBhgSkole,
    };

    return apiData;
};
