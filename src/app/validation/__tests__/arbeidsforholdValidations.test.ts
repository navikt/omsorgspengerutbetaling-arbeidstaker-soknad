import { stegEnListeAvArbeidsforholdIsValid } from '../components/arbeidsforholdValidations';
import { ArbeidsforholdFormData, Utbetalingsårsak } from '../../types/ArbeidsforholdTypes';
import { YesOrNo } from 'common/types/YesOrNo';
import { Attachment } from 'common/types/Attachment';
import { FraværDag, FraværPeriode, FraværÅrsak } from '@navikt/sif-common-forms/lib/fravær';

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

const validArbeidsforhold1: ArbeidsforholdFormData = {
    navn: 'Pengepingen',
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.NO,
    utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
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
    utbetalingsårsak: Utbetalingsårsak.arbeidsgiverKonkurs,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
    harPerioderMedFravær: YesOrNo.YES,
    fraværPerioder: validPerioderMedFravær,
    harDagerMedDelvisFravær: YesOrNo.YES,
    fraværDager: validListeAvFraværDelerAvDag,
    dokumenter: [],
};

const validListeAvArbeidsforhold: ArbeidsforholdFormData[] = [validArbeidsforhold1, validArbeidsforhold2];

const invalidArbeidsforhold1: ArbeidsforholdFormData = {
    navn: '',
    organisasjonsnummer: '1234',
    harHattFraværHosArbeidsgiver: YesOrNo.YES,
    arbeidsgiverHarUtbetaltLønn: YesOrNo.UNANSWERED,
    utbetalingsårsak: Utbetalingsårsak.ikkeBesvart,
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
});
