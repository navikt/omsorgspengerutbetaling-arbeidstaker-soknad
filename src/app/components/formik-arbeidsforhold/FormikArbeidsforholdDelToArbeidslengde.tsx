import React from 'react';
import { FieldArray } from 'formik';
import {
    AnsettelseslengdeFormDataFields,
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    SøknadFormField
} from '../../types/SøknadFormData';
import './formik-arbeidsforhold.less';
import FormikArbeidslengdeView from './FormikArbeidslengde';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelToArbeidslengde: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getArbeidsforholdFormDataFieldName = (field: ArbeidsforholdFormDataFields) =>
                    `${name}.${index}.${field}`;
                const getAnsettelseslengdeFormDataFieldName = (field: AnsettelseslengdeFormDataFields) =>
                    `${getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.ansettelseslengde)}.${field}`;

                const nameHvorLengeJobbet = getAnsettelseslengdeFormDataFieldName(
                    AnsettelseslengdeFormDataFields.hvorLengeJobbet
                );
                const nameBegrunnelse = getAnsettelseslengdeFormDataFieldName(
                    AnsettelseslengdeFormDataFields.begrunnelse
                );
                const nameForklaring = getAnsettelseslengdeFormDataFieldName(
                    AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring
                );
                const nameDokumenter = getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.dokumenter);

                return (
                    <FormikArbeidslengdeView
                        arbeidsforholdFormData={arbeidsforholdFormData}
                        nameHvorLengeJobbet={nameHvorLengeJobbet}
                        nameBegrunnelse={nameBegrunnelse}
                        nameForklaring={nameForklaring}
                        nameDokumenter={nameDokumenter}
                    />
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelToArbeidslengde;
