import React from 'react';
import { FieldArray } from 'formik';
import './formik-arbeidsforhold.less';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdArbeidslengde from './FormikArbeidsforholdArbeidslengde';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { AnsettelseslengdeFormDataFields } from '../../types/AnsettelseslengdeTypes';

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
                const getAnsettelseslengdeFormDataFieldName = (field: AnsettelseslengdeFormDataFields): string =>
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
