import { Arbeidsgiver, Person, Søkerdata } from '../Søkerdata';
import {
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    initialValues,
    SøknadFormData,
    SøknadFormField
} from '../SøknadFormData';
import { YesOrNo } from 'common/types/YesOrNo';



export const gyldigPerson: Person = {
    etternavn: "Duck",
    fornavn: "Donald",
    mellomnavn: "Mc.",
    kjønn: "mann",
    fødselsnummer: "12345678903",
    myndig: true
};
export const ugyldigPerson1: any = null;
export const ugyldigPerson2: any = undefined;
export const ugyldigPerson3: any = {};
export const ugyldigPerson4: any = 'ugyldig person';
export const ugyldigPerson5: any = {
    etternavn: "Duck",
    fornavn: "Donald",
    mellomnavn: "Mc.",
    kjønn: "mann",
    fødselsnummer: "12345678903"
};

export const gyldigArbeidsgiver1: Arbeidsgiver = {
    navn: 'Wizard og the Coast',
    organisasjonsnummer: '12345678903'
};

export const gyldigArbeidsgiver2: Arbeidsgiver = {
    navn: 'Wizard og the Coast',
    organisasjonsnummer: '12345678903'
};

export const ugyldigArbeidsgiver1: any = null;
export const ugyldigArbeidsgiver2: any = undefined;
export const ugyldigArbeidsgiver3: any = {};
export const ugyldigArbeidsgiver4: any = 'ugyldig arbeidsgiver';
export const ugyldigArbeidsgiver5: any = {
    navn: 'En ugyldig arbeidsgiver'
};
export const ugyldigArbeidsgiver6: any = {
    organisasjonsnummer: 'En ugyldig arbeidsgiver'
};

export const listeAvGydligeArbeidsgivere: Arbeidsgiver[] = [gyldigArbeidsgiver1, gyldigArbeidsgiver2];
export const listeAvUgyldigeArbeidsgivere: any[] = [
    ugyldigArbeidsgiver1,
    ugyldigArbeidsgiver2,
    ugyldigArbeidsgiver3,
    ugyldigArbeidsgiver4,
    ugyldigArbeidsgiver5,
    ugyldigArbeidsgiver6
];
export const listeAvBådeUgyldigeOgGyldigeArbeidsgivere: any[] = [
    gyldigArbeidsgiver1,
    ugyldigArbeidsgiver1,
    gyldigArbeidsgiver2,
    ugyldigArbeidsgiver3,
    ugyldigArbeidsgiver4
];

export const gyldigSøkerdata1: Søkerdata = {
    person: gyldigPerson
};
export const ugyldigSøkerdata1: any = null;
export const ugyldigSøkerdata2: any = undefined;
export const ugyldigSøkerdata3: any = {};
export const ugyldigSøkerdata4: any = 'ugyldig søkerdata';
export const ugyldigSøkerdata5: any = {
    navn: 'Ugyldig søkerdata'
};

export const gyldigSøkerdata2: Søkerdata = {
    "person": {
        "fornavn": "Test",
        "mellomnavn": null,
        "etternavn": "Testesen",
        "fødselsnummer": "12345123456",
        "myndig": true
    }
};

export const gyldigSøknadFormData: SøknadFormData = initialValues;
export const ugyldigSøknadFormData1: any = null;
export const ugyldigSøknadFormData2: any = undefined;
export const ugyldigSøknadFormData3: any = {};
export const ugyldigSøknadFormData4: any = 'ugyldig SøknadFormData';
export const ugyldigSøknadFormData5: any = {
    // [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,
    [SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver]: HvorLengeJobbet.IKKE_BESVART,
    [SøknadFormField.hvorLengeJobbetFordi]: HvorLengeJobbetFordi.IKKE_BESVART,
    [SøknadFormField.dokumenter]: [],
    [SøknadFormField.arbeidsforhold]: [],
    [SøknadFormField.har_fosterbarn]: YesOrNo.UNANSWERED,
    [SøknadFormField.fosterbarn]: [],
    [SøknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioderMedFravær]: [],
    [SøknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SøknadFormField.dagerMedDelvisFravær]: [],
    [SøknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SøknadFormField.perioder_utenlandsopphold]: [],
    [SøknadFormField.har_søkt_andre_utbetalinger]: YesOrNo.UNANSWERED,
    [SøknadFormField.andre_utbetalinger]: [],
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: []
};

