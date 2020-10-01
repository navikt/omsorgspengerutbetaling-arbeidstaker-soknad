import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { Attachment } from 'common/types/Attachment';
import { ArbeidsforholdFormDataFields } from '../types/ArbeidsforholdTypes';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values.arbeidsforhold.map((arbeidsforhold) => arbeidsforhold.dokumenter).flat(),
    ...values[SøknadFormField.annetArbeidsforhold][ArbeidsforholdFormDataFields.dokumenter],
    ...values[SøknadFormField.smittevernDokumenter],
    ...values[SøknadFormField.dokumenterStengtBkgSkole],
];
