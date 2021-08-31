import { SøknadApiData } from '../types/SøknadApiData';
import { mapToBekreftelser } from './formToApiMaps/mapFunctions';
import { SøknadFormData } from '../types/SøknadFormData';
import { IntlShape } from 'react-intl';
import { Locale } from 'common/types/Locale';
import { settInnBosteder } from './formToApiMaps/mapBostedUtlandToApiData';
import { settInnOpphold } from './formToApiMaps/mapUtenlandsoppholdToApiData';
import { YesOrNo } from 'common/types/YesOrNo';
import {
    listOfArbeidsforholdFormDataToListOfAttachmentStrings,
    listOfAttachmentsToListOfUrlStrings,
} from './formToApiMaps/mapVedleggToApiData';
import { mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer } from './formToApiMaps/mapArbeidsforholdToApiData';
import { isFrilanser, isSelvstendig } from './selvstendigOgEllerFrilansUtils';
import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Situasjon
        arbeidsforhold,

        // STEG 2: Periode

        // STEG 3: ANNET
        perioderHarVærtIUtlandet,
        perioderUtenlandsopphold,
        erSelvstendigOgEllerFrilans,
        selvstendigOgEllerFrilans,

        // STEG 4: Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,

        hjemmePgaSmittevernhensynYesOrNo,
        smittevernDokumenter,
        hjemmePgaStengtBhgSkole,
        dokumenterStengtBkgSkole,
    }: SøknadFormData,
    intl: IntlShape
): SøknadApiData => {
    const _vedleggSmittevern =
        hjemmePgaSmittevernhensynYesOrNo === YesOrNo.YES
            ? listOfAttachmentsToListOfUrlStrings(smittevernDokumenter)
            : [];

    const _vedleggStengtBhgSkole =
        isFeatureEnabled(Feature.STENGT_BHG_SKOLE) && hjemmePgaStengtBhgSkole === YesOrNo.YES
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
        bekreftelser: mapToBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        erSelvstendig: isSelvstendig(erSelvstendigOgEllerFrilans, selvstendigOgEllerFrilans),
        erFrilanser: isFrilanser(erSelvstendigOgEllerFrilans, selvstendigOgEllerFrilans),
        hjemmePgaSmittevernhensyn: hjemmePgaSmittevernhensynYesOrNo === YesOrNo.YES,
        hjemmePgaStengtBhgSkole: isFeatureEnabled(Feature.STENGT_BHG_SKOLE)
            ? hjemmePgaStengtBhgSkole === YesOrNo.YES
            : undefined,
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
