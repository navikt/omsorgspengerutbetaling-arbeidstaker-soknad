import React from 'react';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields, SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdSituasjonView from './FormikArbeidsforholdSituasjon';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelEn: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    const intl = useIntl();
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdFormDataFields) => `${name}.${index}.${field}`;

                const nameHarHattFraværHosArbeidsgiver = getFieldName(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver);
                const nameArbeidsgiverHarUtbetaltLønn = getFieldName(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn);

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
