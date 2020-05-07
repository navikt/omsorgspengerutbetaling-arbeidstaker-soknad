import { isArbeidsgiver, isArbeidsgivere, isPerson, isSøkerApiResponse, isSøkerdata } from '../Søkerdata';
import {
    gyldigArbeidsgiver1,
    gyldigArbeidsgiver2,
    gyldigArbeidsgiver6,
    gyldigPerson,
    gyldigSøkerApiResponse,
    gyldigSøkerdata1,
    gyldigSøkerdata2,
    gyldigSøknadFormData,
    listeAvBådeUgyldigeOgGyldigeArbeidsgivere,
    listeAvGydligeArbeidsgivere,
    listeAvUgyldigeArbeidsgivere,
    ugyldigArbeidsgiver1,
    ugyldigArbeidsgiver2,
    ugyldigArbeidsgiver3,
    ugyldigArbeidsgiver4,
    ugyldigArbeidsgiver5,
    ugyldigPerson1,
    ugyldigPerson2,
    ugyldigPerson3,
    ugyldigPerson4,
    ugyldigPerson5,
    ugyldigSøkerApiResponse,
    ugyldigSøkerdata1,
    ugyldigSøkerdata2,
    ugyldigSøkerdata3,
    ugyldigSøkerdata4,
    ugyldigSøkerdata5,
    ugyldigSøknadFormData1,
    ugyldigSøknadFormData2,
    ugyldigSøknadFormData3,
    ugyldigSøknadFormData4,
    ugyldigSøknadFormData5
} from '../mockData/typeGuardsMockData';
import { isString } from 'formik';
import { isStringOrNull } from '../typeGuardUtilities';
import { isSøknadFormData } from '../SøknadFormDataTypeGuards';

describe('Type Guards', () => {
    describe('Person', () => {
        it('isPerson evaluerer riktig', () => {
            expect(isPerson(gyldigPerson)).toBe(true);
            expect(isPerson(ugyldigPerson1)).toBe(false);
            expect(isPerson(ugyldigPerson2)).toBe(false);
            expect(isPerson(ugyldigPerson3)).toBe(false);
            expect(isPerson(ugyldigPerson4)).toBe(false);
            expect(isPerson(ugyldigPerson5)).toBe(false);
        });
    });

    describe('Arbeidsgivere og arbeidsgiver', () => {
        it('isArbeidsgiver evaluerer riktig', () => {
            expect(isArbeidsgiver(gyldigArbeidsgiver1)).toBe(true);
            expect(isArbeidsgiver(gyldigArbeidsgiver2)).toBe(true);
            expect(isArbeidsgiver(ugyldigArbeidsgiver1)).toBe(false);
            expect(isArbeidsgiver(ugyldigArbeidsgiver2)).toBe(false);
            expect(isArbeidsgiver(ugyldigArbeidsgiver3)).toBe(false);
            expect(isArbeidsgiver(ugyldigArbeidsgiver4)).toBe(false);
            expect(isArbeidsgiver(ugyldigArbeidsgiver5)).toBe(false);
            expect(isArbeidsgiver(gyldigArbeidsgiver6)).toBe(true);
        });
        it('isArbeidsgivere med foldRight evaluerer riktig', () => {
            expect(isArbeidsgivere(listeAvGydligeArbeidsgivere)).toBe(true);
            expect(isArbeidsgivere(listeAvUgyldigeArbeidsgivere)).toBe(false);
            expect(isArbeidsgivere(listeAvBådeUgyldigeOgGyldigeArbeidsgivere)).toBe(false);
        });
    });

    describe('Søkerdata', () => {
        it('isSøkerdata evaluerer riktig', () => {
            expect(isSøkerdata(gyldigSøkerdata1)).toBe(true);
            expect(isSøkerdata(gyldigSøkerdata2)).toBe(true);
            expect(isSøkerdata(ugyldigSøkerdata1)).toBe(false);
            expect(isSøkerdata(ugyldigSøkerdata2)).toBe(false);
            expect(isSøkerdata(ugyldigSøkerdata3)).toBe(false);
            expect(isSøkerdata(ugyldigSøkerdata4)).toBe(false);
            expect(isSøkerdata(ugyldigSøkerdata5)).toBe(false);
        });
    });

    describe('SøknadFormData', () => {
        it('isSøknadFormData evaluerer riktig', () => {
            expect(isSøknadFormData(gyldigSøknadFormData)).toBe(true);
            expect(isSøknadFormData(ugyldigSøknadFormData1)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData2)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData3)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData4)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData5)).toBe(false);
        });
    });

    describe('formik typeguards test', () => {
        it('isString', () => {
            expect(isString(undefined)).toBe(false);
            expect(isString(null)).toBe(false);
            expect(isString({})).toBe(false);
            expect(isString('')).toBe(true);
            expect(isString('a string')).toBe(true);
        });
    });

    describe('typeGuardUtilities', () => {
        it('isStringOrNull', () => {
            expect(isStringOrNull('undefined')).toBe(true);
            expect(isStringOrNull('')).toBe(true);
            expect(isStringOrNull(null)).toBe(true);
            expect(isStringOrNull(undefined)).toBe(false);
            expect(isStringOrNull({})).toBe(false);
        });
    });

    describe('isSøkerApiResponse', () => {
        it('isSøkerApiResponse', () => {
            expect(isSøkerApiResponse(gyldigSøkerApiResponse)).toBe(true);
            expect(isSøkerApiResponse(ugyldigSøkerApiResponse)).toBe(false);
            expect(isSøkerApiResponse(null)).toBe(false);
            expect(isSøkerApiResponse(undefined)).toBe(false);
            expect(isSøkerApiResponse(false)).toBe(false);
            expect(isSøkerApiResponse({})).toBe(false);
            expect(isSøkerApiResponse('string')).toBe(false);
        });
    });
});
