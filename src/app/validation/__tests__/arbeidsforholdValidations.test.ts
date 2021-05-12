import {
    checkAllePerioderErInnenforSammeKalenderår,
    stegEnListeAvArbeidsforholdIsValid,
} from '../components/arbeidsforholdValidations';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import { AnsettelseslengdeFormData, HvorLengeJobbet, HvorLengeJobbetFordi } from '../../types/AnsettelseslengdeTypes';
import { Attachment } from 'common/types/Attachment';
import { FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib/fravær';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';

const validAttachment: Attachment = {
    file: {
        isPersistedFile: true,
        name: 'navn-pa-fil',
        lastModified: 3,
        size: 2,
        type: 'pdf',
    },
    pending: false,
    uploaded: true,
    url: 'alskdn',
};

const gylidgPeriodeMedFravær1: FraværPeriode = {
    fraOgMed: new Date('2020-01-01'),
    tilOgMed: new Date('2020-01-02'),
    årsak: FraværÅrsak.ordinært,
};

const validPerioderMedFravær: FraværPeriode[] = [gylidgPeriodeMedFravær1];

const validFraværDelerAvDag: FraværDag = {
    dato: new Date('2020-02-01'),
    timerArbeidsdag: '6',
    timerFravær: '3',
    årsak: FraværÅrsak.ordinært,
};

const validListeAvFraværDelerAvDag: FraværDag[] = [validFraværDelerAvDag];

const validAnsettelseslengde1: AnsettelseslengdeFormData = {
    hvorLengeJobbet: HvorLengeJobbet.MER_ENN_FIRE_UKER,
    begrunnelse: HvorLengeJobbetFordi.IKKE_BESVART,
    ingenAvSituasjoneneForklaring: '',
};

const validAnsettelseslengde2: AnsettelseslengdeFormData = {
    hvorLengeJobbet: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
    begrunnelse: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON,
    ingenAvSituasjoneneForklaring: '',
};

const validArbeidsforhold1: ArbeidsforholdFormData = {
    navn: 'Pengepingen',
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.NO,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
    ansettelseslengde: validAnsettelseslengde1,
    harPerioderMedFravær: YesOrNo.YES,
    fraværPerioder: validPerioderMedFravær,
    harDagerMedDelvisFravær: YesOrNo.YES,
    fraværDager: validListeAvFraværDelerAvDag,
    dokumenter: [validAttachment],
};

const validArbeidsforhold2: ArbeidsforholdFormData = {
    navn: 'Pengepingen',
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.NO,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
    ansettelseslengde: validAnsettelseslengde2,
    harPerioderMedFravær: YesOrNo.YES,
    fraværPerioder: validPerioderMedFravær,
    harDagerMedDelvisFravær: YesOrNo.YES,
    fraværDager: validListeAvFraværDelerAvDag,
    dokumenter: [],
};

const validArbeidsforhold3: ArbeidsforholdFormData = {
    navn: 'Pengepingen',
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.YES,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.NO,
    ansettelseslengde: validAnsettelseslengde2,
    harPerioderMedFravær: YesOrNo.YES,
    fraværPerioder: validPerioderMedFravær,
    harDagerMedDelvisFravær: YesOrNo.YES,
    fraværDager: validListeAvFraværDelerAvDag,
    dokumenter: [],
};

const validListeAvArbeidsforhold: ArbeidsforholdFormData[] = [validArbeidsforhold1, validArbeidsforhold2];

const invalidArbeidsforhold1: ArbeidsforholdFormData = {
    navn: null,
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.YES,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
    ansettelseslengde: validAnsettelseslengde2,
    harPerioderMedFravær: YesOrNo.YES,
    fraværPerioder: validPerioderMedFravær,
    harDagerMedDelvisFravær: YesOrNo.YES,
    fraværDager: validListeAvFraværDelerAvDag,
    dokumenter: [],
};

const invalidListeAvArbeidsforhold: ArbeidsforholdFormData[] = [
    validArbeidsforhold1,
    invalidArbeidsforhold1,
    validArbeidsforhold2,
];

describe('fieldValidations', () => {
    it('validates lists correctly', () => {
        expect(stegEnListeAvArbeidsforholdIsValid(validListeAvArbeidsforhold)).toBe(true);
        expect(stegEnListeAvArbeidsforholdIsValid(invalidListeAvArbeidsforhold)).toBe(false);
    });

    describe('checkAllePerioderErInnenforSammeKalenderår', () => {
        const dagMedFravær2020: any = {
            dato: ISOStringToDate('2020-01-01')!,
        };
        const dagMedFravær2021: any = {
            dato: ISOStringToDate('2021-01-01')!,
        };
        const periodeMedFravær2020: any = {
            fraOgMed: ISOStringToDate('2020-01-01')!,
            tilOgMed: ISOStringToDate('2020-01-10')!,
        };
        const periodeMedFravær2020_2021: any = {
            fraOgMed: ISOStringToDate('2020-01-01')!,
            tilOgMed: ISOStringToDate('2021-01-10')!,
        };
        const periodeMedFravær2021: any = {
            fraOgMed: ISOStringToDate('2021-01-01')!,
            tilOgMed: ISOStringToDate('2021-01-10')!,
        };

        const arbeidsforhold: any = {};

        it('returns undefined when all dates are the same year', () => {
            const fraværDager: FraværDag[] = [dagMedFravær2020];
            const fraværPerioder: FraværPeriode[] = [periodeMedFravær2020];
            expect(checkAllePerioderErInnenforSammeKalenderår([], 'Feil')).toBe(undefined);
            expect(
                checkAllePerioderErInnenforSammeKalenderår([{ ...arbeidsforhold, fraværDager }], 'Feil')
            ).toBeUndefined();
            expect(
                checkAllePerioderErInnenforSammeKalenderår([{ ...arbeidsforhold, fraværPerioder }], 'Feil')
            ).toBeUndefined();
            expect(
                checkAllePerioderErInnenforSammeKalenderår([{ ...arbeidsforhold, fraværPerioder, fraværDager }], 'Feil')
            ).toBeUndefined();
        });
        it('returns error when two fraværPerioder has different years', () => {
            expect(
                checkAllePerioderErInnenforSammeKalenderår(
                    [{ ...arbeidsforhold, fraværPerioder: [periodeMedFravær2020, periodeMedFravær2021] }],
                    'Feil'
                )
            ).toBeDefined();
        });
        it('returns error when one fraværPeriode spans two years', () => {
            expect(
                checkAllePerioderErInnenforSammeKalenderår(
                    [{ ...arbeidsforhold, fraværPerioder: [periodeMedFravær2020_2021] }],
                    'Feil'
                )
            ).toBeDefined();
        });
        it('returns error when fraværDag is another year than fraværPeriode', () => {
            expect(
                checkAllePerioderErInnenforSammeKalenderår(
                    [{ ...arbeidsforhold, fraværDager: [dagMedFravær2020], fraværPerioder: [periodeMedFravær2021] }],
                    'Feil'
                )
            ).toBeDefined();
        });
        it('returns error when fraværDag has another year than another fraværDag', () => {
            expect(
                checkAllePerioderErInnenforSammeKalenderår(
                    [{ ...arbeidsforhold, fraværDager: [dagMedFravær2020, dagMedFravær2021] }],
                    'Feil'
                )
            ).toBeDefined();
        });
    });
});
