import { Utenlandsopphold } from '@navikt/sif-common-forms/lib//utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { AndreUtbetalinger } from './AndreUtbetalinger';
import { ArbeidsforholdFormData, initialArbeidsforholdFormData } from './ArbeidsforholdTypes';
import { Attachment } from 'common/types/Attachment';
import { SelvstendigOgEllerFrilans } from './SelvstendigOgEllerFrilansTypes';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Barn
    andreBarn = 'andreBarn',
    harAleneomsorg = 'harAleneomsorg',
    harAleneomsorgFor = 'harAleneomsorgFor',

    // Arbeidsforhold
    arbeidsforhold = 'arbeidsforhold',
    annetArbeidsforhold = 'annetArbeidsforhold',

    // Opphold Utland
    perioderHarVærtIUtlandet = 'perioderHarVærtIUtlandet',
    perioderUtenlandsopphold = 'perioderUtenlandsopphold',

    // Andre Utbeatlinger
    harSøktAndreUtbetalinger = 'harSøktAndreUtbetalinger',
    andreUtbetalinger = 'andreUtbetalinger',

    // Er SN&F i tillegg
    erSelvstendigOgEllerFrilans = 'erSelvstendigOgEllerFrilans',
    selvstendigOgEllerFrilans = 'selvstendigOgEllerFrilans',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',

    dokumenterSmittevernhensyn = 'dokumenterSmittevernhensyn',
    dokumenterStengtBkgSkole = 'dokumenterStengtBkgSkole',
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;

    // Barn
    [SøknadFormField.andreBarn]: AnnetBarn[];
    [SøknadFormField.harAleneomsorg]: YesOrNo;
    [SøknadFormField.harAleneomsorgFor]: Array<string>;

    // Arbeidsforhold
    [SøknadFormField.arbeidsforhold]: ArbeidsforholdFormData[];
    [SøknadFormField.annetArbeidsforhold]: ArbeidsforholdFormData;

    // Opphold Utland
    [SøknadFormField.perioderHarVærtIUtlandet]: YesOrNo;
    [SøknadFormField.perioderUtenlandsopphold]: Utenlandsopphold[];

    // Andre Utbeatlinger
    [SøknadFormField.harSøktAndreUtbetalinger]: YesOrNo;
    [SøknadFormField.andreUtbetalinger]: AndreUtbetalinger[];

    // Selvstendig og eller frilans
    [SøknadFormField.erSelvstendigOgEllerFrilans]: YesOrNo;
    [SøknadFormField.selvstendigOgEllerFrilans]: SelvstendigOgEllerFrilans[];

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];

    [SøknadFormField.dokumenterSmittevernhensyn]: Attachment[];
    [SøknadFormField.dokumenterStengtBkgSkole]: Attachment[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,

    // Barn
    [SøknadFormField.andreBarn]: [],
    [SøknadFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [SøknadFormField.harAleneomsorgFor]: [],

    // Arbeidsforhold
    [SøknadFormField.arbeidsforhold]: [],
    [SøknadFormField.annetArbeidsforhold]: initialArbeidsforholdFormData,

    // Opphold Utland
    [SøknadFormField.perioderHarVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderUtenlandsopphold]: [],

    // Andre Utbeatlinger
    [SøknadFormField.harSøktAndreUtbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andreUtbetalinger]: [],

    // Er selvstendig og eller frilans
    [SøknadFormField.erSelvstendigOgEllerFrilans]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendigOgEllerFrilans]: [],

    // Medlemskap
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],

    [SøknadFormField.dokumenterSmittevernhensyn]: [],
    [SøknadFormField.dokumenterStengtBkgSkole]: [],
};
