import { IntlShape } from 'react-intl';
import { Fosterbarn } from '@navikt/sif-common-forms/lib';
import { Locale } from 'common/types/Locale';
import { YesOrNo } from 'common/types/YesOrNo';
import { ApiFosterbarn, SøknadApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from './arbeidsforholdUtils';
import { mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer } from './formToApiMaps/mapArbeidsforholdToApiData';
import { settInnBosteder } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapToBekreftelser } from './formToApiMaps/mapFunctions';
import { settInnOpphold } from './formToApiMaps/mapUtenlandsoppholdToApiData';
import {
    listOfArbeidsforholdFormDataToListOfAttachmentStrings,
    listOfAttachmentsToListOfUrlStrings,
} from './formToApiMaps/mapVedleggToApiData';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from './periodeUtils';
import { isFrilanser, isSelvstendig } from './selvstendigOgEllerFrilansUtils';

export const mapFosterbarnToApiFosterbarn = ({ fødselsnummer }: Fosterbarn): ApiFosterbarn => ({
    identitetsnummer: fødselsnummer,
});

export const mapFormDataToApiData = (values: SøknadFormData, intl: IntlShape): SøknadApiData => {
    const {
        harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger,

        arbeidsforhold,
        annetArbeidsforhold,

        perioderHarVærtIUtlandet,
        perioderUtenlandsopphold,
        harSøktAndreUtbetalinger,
        andreUtbetalinger,
        erSelvstendigOgEllerFrilans,
        selvstendigOgEllerFrilans,

        harBoddUtenforNorgeSiste12Mnd,
        utenlandsoppholdSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,

        dokumenterStengtBkgSkole,
        dokumenterSmittevernhensyn,
        harFosterbarn,
        fosterbarn,
    } = values;

    const allePerioder = getAlleUtbetalingsperioder(values);
    const hjemmePgaSmittevernhensyn = harFraværPgaSmittevernhensyn(allePerioder);
    const hjemmePgaStengtBhgSkole = harFraværPgaStengBhgSkole(allePerioder);

    const _vedleggSmittevern = hjemmePgaSmittevernhensyn
        ? listOfAttachmentsToListOfUrlStrings(dokumenterSmittevernhensyn)
        : [];

    const _vedleggStengtBhgSkole = hjemmePgaStengtBhgSkole
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
        fosterbarn: fosterbarn.map(mapFosterbarnToApiFosterbarn),
        opphold: settInnOpphold(perioderHarVærtIUtlandet, perioderUtenlandsopphold, intl.locale), // periode siden, har du oppholdt
        arbeidsgivere: mapListeAvArbeidsforholdFormDataToListeAvArbeidsgiverDetaljer([
            ...arbeidsforhold,
            annetArbeidsforhold,
        ]),
        bekreftelser: mapToBekreftelser(harForståttRettigheterOgPlikter, harBekreftetOpplysninger),
        andreUtbetalinger: harSøktAndreUtbetalinger === YesOrNo.YES ? [...andreUtbetalinger] : [],
        erSelvstendig: isSelvstendig(erSelvstendigOgEllerFrilans, selvstendigOgEllerFrilans),
        erFrilanser: isFrilanser(erSelvstendigOgEllerFrilans, selvstendigOgEllerFrilans),
        hjemmePgaSmittevernhensyn,
        hjemmePgaStengtBhgSkole,
        vedlegg: [
            ...listOfArbeidsforholdFormDataToListOfAttachmentStrings([...arbeidsforhold, annetArbeidsforhold]),
            ..._vedleggSmittevern,
            ..._vedleggStengtBhgSkole,
        ],
        _vedleggSmittevern,
        _vedleggStengtBhgSkole,
        _harFosterbarn: harFosterbarn === YesOrNo.YES,
    };

    return apiData;
};
