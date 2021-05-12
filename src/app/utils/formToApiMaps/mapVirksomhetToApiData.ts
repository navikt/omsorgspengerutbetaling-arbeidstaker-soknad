import { Næringstype } from '@navikt/sif-common-forms/lib';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKE) !== undefined;
