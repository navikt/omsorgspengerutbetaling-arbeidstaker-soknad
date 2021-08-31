import React from 'react';
import { FieldArray } from 'formik';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdArbeidslengde from './FormikArbeidsforholdArbeidslengde';
import './formik-arbeidsforhold.less';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelToArbeidslengde: React.FunctionComponent<Props> = ({
    arbeidsforholdFormData,
    index,
}: Props) => {
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }): JSX.Element => {
                const getArbeidsforholdFormDataFieldName = (field: ArbeidsforholdFormDataFields): string =>
                    `${name}.${index}.${field}`;
                const nameUtbetalingsårsak = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.utbetalingsårsak
                );
                const nameKonfliktForklaring = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.konfliktForklaring
                );
                const nameDokumenter = getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.dokumenter);

                return (
                    <FormikArbeidsforholdArbeidslengde
                        arbeidsforholdFormData={arbeidsforholdFormData}
                        nameDokumenter={nameDokumenter}
                        nameUtbetalingsårsak={nameUtbetalingsårsak}
                        nameKonfliktForklaring={nameKonfliktForklaring}
                    />
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelToArbeidslengde;
