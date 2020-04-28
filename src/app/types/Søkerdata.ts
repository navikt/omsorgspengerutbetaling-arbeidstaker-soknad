export interface Person {
    etternavn: string | null;
    fornavn: string | null;
    mellomnavn: string | null;
    fødselsnummer: string;
    myndig: boolean;
    kjønn?: string;
}

export interface SøkerApiResponse {
    aktørId: string;
    fødselsdato: string; // TODO: Verifiser riktig, og bruk isDate hvis behov
    fødselsnummer: string;
    fornavn: string | null; // TODO: Sendes det "null" eller null ? Hvordan ønsker vi å håndtere en bruker som ikke har et registrert navn?
    mellomnavn: string | null;
    etternavn: string | null;
    myndig: boolean;
}

export interface Søkerdata {
    person: Person;
    arbeidsgivere: Arbeidsgiver[];
}

export interface ArbeidsgiverResponse {
    organisasjoner: Arbeidsgiver[];
}

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export const isSøkerdata = (maybeSøkerdata: any): maybeSøkerdata is Søkerdata => {
    if (
        maybeSøkerdata &&
        typeof maybeSøkerdata === 'object' &&
        maybeSøkerdata.person &&
        isPerson(maybeSøkerdata.person) &&
        maybeSøkerdata.arbeidsgivere &&
        isArbeidsgivere(maybeSøkerdata.arbeidsgivere)
    ) {
        return true;
    }
    return false;
};

export const isPerson = (maybePerson: any): maybePerson is Person => {
    if (
        maybePerson &&
        typeof maybePerson === 'object' &&
        maybePerson.fødselsnummer &&
        typeof maybePerson.fødselsnummer === 'string' &&
        maybePerson.myndig &&
        typeof maybePerson.myndig === 'boolean'
    ) {
        return true;
    }
    return false;
};

export const isArbeidsgivere = (maybeArbeidsgivere: any): maybeArbeidsgivere is Arbeidsgiver[] => {
    if (
        maybeArbeidsgivere &&
        typeof Array.isArray(maybeArbeidsgivere) &&
        (maybeArbeidsgivere as any[]).reduceRight((previousValue, currentValue) => {
            if (!previousValue) {
                return false;
            }
            return !!isArbeidsgiver(currentValue);
        }, true)
    ) {
        return true;
    }
    return false;
};

export const isArbeidsgiver = (maybeArbeidsgiver: any): maybeArbeidsgiver is Arbeidsgiver => {
    if (
        maybeArbeidsgiver &&
        typeof maybeArbeidsgiver === 'object' &&
        (maybeArbeidsgiver as Arbeidsgiver).navn &&
        typeof (maybeArbeidsgiver as Arbeidsgiver).navn === 'string' &&
        (maybeArbeidsgiver as Arbeidsgiver).organisasjonsnummer &&
        typeof (maybeArbeidsgiver as Arbeidsgiver).organisasjonsnummer === 'string'
    ) {
        return true;
    }
    return false;
};
