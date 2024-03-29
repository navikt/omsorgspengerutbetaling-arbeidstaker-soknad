import { SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { Attachment } from 'common/types/Attachment';

export const valuesToAlleDokumenterISøknaden = (values: SøknadFormData): Attachment[] => [
    ...values.arbeidsforhold.map((arbeidsforhold) => arbeidsforhold.dokumenter).flat(),
    ...values[SøknadFormField.smittevernDokumenter],
    ...values[SøknadFormField.dokumenterStengtBkgSkole],
];
