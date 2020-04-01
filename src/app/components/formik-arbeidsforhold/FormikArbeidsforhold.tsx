import React from 'react';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { Arbeidsforhold, ArbeidsforholdField, SøknadFormField } from '../../types/SøknadFormData';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforhold: React.FunctionComponent<Props> = ({ arbeidsforhold, index }) => {
    const intl = useIntl();
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as SøknadFormField;
                return (
                    <>
                        <FormikYesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.harHattFraværHosArbeidsgiver)}
                        />
                        {
                            arbeidsforhold[ArbeidsforholdField.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                                <FormikYesOrNoQuestion
                                    legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                                    name={getFieldName(ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn)}
                                />
                            )
                        }
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
