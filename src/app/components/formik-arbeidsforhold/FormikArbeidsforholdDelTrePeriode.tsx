import React from 'react';
import { FieldArray } from 'formik';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdPeriodeView from './FormikArbeidsforholdPeriode';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelTrePeriodeView: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }): JSX.Element => {
                const getArbeidsforholdFormDataFieldName = (field: ArbeidsforholdFormDataFields): string =>
                    `${name}.${index}.${field}`;

                const nameHarPerioderMedFravær = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.harPerioderMedFravær
                );
                const namePerioderMedFravær = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.fraværPerioder
                );
                const nameHarDagerMedDelvisFravær = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.harDagerMedDelvisFravær
                );
                const nameDagerMedDelvisFravær = getArbeidsforholdFormDataFieldName(
                    ArbeidsforholdFormDataFields.fraværDager
                );

                return (
                    <FormikArbeidsforholdPeriodeView
                        arbeidsforholdFormData={arbeidsforholdFormData}
                        nameHarPerioderMedFravær={nameHarPerioderMedFravær}
                        namePerioderMedFravær={namePerioderMedFravær}
                        nameHarDagerMedDelvisFravær={nameHarDagerMedDelvisFravær}
                        nameDagerMedDelvisFravær={nameDagerMedDelvisFravær}
                    />
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelTrePeriodeView;
