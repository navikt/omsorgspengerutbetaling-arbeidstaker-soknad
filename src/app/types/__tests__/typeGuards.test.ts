import { isArbeidsgiver, isArbeidsgivere, isPerson, isSøkerdata } from '../Søkerdata';
import {
    gyldigArbeidsgiver1,
    gyldigArbeidsgiver2,
    gyldigPerson,
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
    ugyldigArbeidsgiver6,
    ugyldigPerson1,
    ugyldigPerson2,
    ugyldigPerson3,
    ugyldigPerson4,
    ugyldigPerson5,
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
import { isSøknadFormData } from '../SøknadFormData';

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
            expect(isArbeidsgiver(ugyldigArbeidsgiver6)).toBe(false);
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
        })
    })

    describe('SøknadFormData', () => {
        it('isSøknadFormData evaluerer riktig', () => {
            expect(isSøknadFormData(gyldigSøknadFormData)).toBe(true);
            expect(isSøknadFormData(ugyldigSøknadFormData1)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData2)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData3)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData4)).toBe(false);
            expect(isSøknadFormData(ugyldigSøknadFormData5)).toBe(false);
        })
    })
});
