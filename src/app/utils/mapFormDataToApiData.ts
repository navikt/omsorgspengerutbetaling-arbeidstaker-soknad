import { SøknadApiData } from '../types/SøknadApiData';
import { mapToBekreftelser, settInnFosterbarn } from './formToApiMaps/mapFunctions';
import { SøknadFormData } from '../types/SøknadFormData';
import { IntlShape } from 'react-intl';
import { Locale } from 'common/types/Locale';
import { settInnBosteder } from './formToApiMaps/mapBostedUtlandToApiData';
import { settInnOpphold } from './formToApiMaps/mapUtenlandsoppholdToApiData';
import { YesOrNo } from 'common/types/YesOrNo';
import {
    listOfArbeidsforholdFormDataToListOfAttachmentStrings,
    listOfAttachmentsToListOfUrlStrings
} from './formToApiMaps/mapVedleggToApiData';
import { mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer } from './formToApiMaps/mapArbeidsforholdToApiData';

export const mapFormDataToApiData = (
    {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        // STEG 1: Situasjon
        arbeidsforhold,
        annetArbeidsforhold,

        harFosterbarn,
        fosterbarn,

        // STEG 2: Periode

        // STEG 3: ANNET
        perioderHarVærtIUtlandet,
        perioderUtenlandsopphold,
        harSøktAndreUtbetalinger,
        andreUtbetalinger,
        erSelvstendigOgEllerFrilans,
        selvstendigOgEllerFrilans,

        // STEG 4: Medlemskap
        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,

        hjemmePgaSmittevernhensynYesOrNo,
        smittevernDokumenter
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
        opphold: settInnOpphold(perioderHarVærtIUtlandet, perioderUtenlandsopphold, intl.locale), // periode siden, har du oppholdt
        arbeidsgivere: mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer([
            ...arbeidsforhold,
            annetArbeidsforhold
        ]),
        bekreftelser: mapToBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        andreUtbetalinger: harSøktAndreUtbetalinger === YesOrNo.YES ? [...andreUtbetalinger] : [],
        selvstendigOgEllerFrilans: erSelvstendigOgEllerFrilans === YesOrNo.YES ? [...selvstendigOgEllerFrilans] : [],
        fosterbarn: settInnFosterbarn(harFosterbarn, fosterbarn),
        hjemmePgaSmittevernhensyn: hjemmePgaSmittevernhensynYesOrNo === YesOrNo.YES,
        vedlegg: [
            ...listOfArbeidsforholdFormDataToListOfAttachmentStrings([...arbeidsforhold, annetArbeidsforhold]),
            ...(hjemmePgaSmittevernhensynYesOrNo === YesOrNo.YES
                ? listOfAttachmentsToListOfUrlStrings(smittevernDokumenter)
                : [])
        ]
    };

    return apiData;
};
