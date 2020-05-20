import React from 'react';
import { FieldArray } from 'formik';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdSituasjonView from './FormikArbeidsforholdSituasjon';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelEn: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }): JSX.Element => {
                const getFieldName = (field: ArbeidsforholdFormDataFields): string => `${name}.${index}.${field}`;

                const nameHarHattFraværHosArbeidsgiver = getFieldName(
                    ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver
                );
                const nameArbeidsgiverHarUtbetaltLønn = getFieldName(
                    ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn
                );

                return (
                    <FormikArbeidsforholdSituasjonView
                        arbeidsforholdFormData={arbeidsforholdFormData}
                        nameHarHattFraværHosArbeidsgiver={nameHarHattFraværHosArbeidsgiver}
                        nameArbeidsgiverHarUtbetaltLønn={nameArbeidsgiverHarUtbetaltLønn}
                    />
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelEn;
