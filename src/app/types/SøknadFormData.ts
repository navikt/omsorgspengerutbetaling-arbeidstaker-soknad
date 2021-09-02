import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { ArbeidsforholdFormData } from './ArbeidsforholdTypes';
import { Attachment } from 'common/types/Attachment';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Arbeidsforhold
    arbeidsforhold = 'arbeidsforhold',

    // Opphold Utland
    perioderHarVærtIUtlandet = 'perioderHarVærtIUtlandet',
    perioderUtenlandsopphold = 'perioderUtenlandsopphold',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',

    hjemmePgaSmittevernhensynYesOrNo = 'hjemmePgaSmittevernhensynYesOrNo',
    smittevernDokumenter = 'smittevernDokumenter',

    // Felter knyttet til stengt bhg eller skole
    hjemmePgaStengtBhgSkole = 'hjemmePgaStengtBhgSkole',
    dokumenterStengtBkgSkole = 'dokumenterStengtBkgSkole',
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // Arbeidsforhold
    [SøknadFormField.arbeidsforhold]: ArbeidsforholdFormData[];

    // Opphold Utland
    [SøknadFormField.perioderHarVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioderUtenlandsopphold]: Utenlandsopphold[];

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];

    [SøknadFormField.hjemmePgaSmittevernhensynYesOrNo]: YesOrNo;
    [SøknadFormField.smittevernDokumenter]: Attachment[];

    [SøknadFormField.hjemmePgaStengtBhgSkole]: YesOrNo;
    [SøknadFormField.dokumenterStengtBkgSkole]: Attachment[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // Arbeidsforhold
    [SøknadFormField.arbeidsforhold]: [],

    // Opphold Utland
    [SøknadFormField.perioderHarVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderUtenlandsopphold]: [],

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],

    [SøknadFormField.hjemmePgaSmittevernhensynYesOrNo]: YesOrNo.UNANSWERED,
    [SøknadFormField.smittevernDokumenter]: [],

    [SøknadFormField.hjemmePgaStengtBhgSkole]: YesOrNo.UNANSWERED,
    [SøknadFormField.dokumenterStengtBkgSkole]: [],
};
