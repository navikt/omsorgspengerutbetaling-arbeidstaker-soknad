import React from 'react';
import { FieldArray } from 'formik';
import './formik-arbeidsforhold.less';
import {
    AnsettelseslengdeFormDataFields,
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    SøknadFormField
} from '../../types/SøknadFormData';
import FormikArbeidsforholdArbeidslengde from './FormikArbeidsforholdArbeidslengde';


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
                    <FormikArbeidsforholdArbeidslengde
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
