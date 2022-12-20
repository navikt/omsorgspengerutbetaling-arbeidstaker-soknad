import { SøknadFormData } from 'app/types/SøknadFormData';
import dayjs from 'dayjs';
import { getAlleFraværDager, getAlleFraværPerioder } from './arbeidsforholdUtils';
import { getÅrstallFromFravær } from './fraværUtils';

export const skalEndringeneFor2023Brukes = (values: SøknadFormData) => {
    const fraværDager = getAlleFraværDager(values);
    const fraværPerioder = getAlleFraværPerioder(values);

    return dayjs().year() === 2023 && getÅrstallFromFravær(fraværDager, fraværPerioder) === 2023;
};
