export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
    myndig: boolean;
}

export interface Søkerdata {
    person: Person;
    setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => void;
    arbeidsgivere?: Arbeidsgiver[];
}

export interface ArbeidsgiverResponse {
    organisasjoner: Arbeidsgiver[]
}

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}