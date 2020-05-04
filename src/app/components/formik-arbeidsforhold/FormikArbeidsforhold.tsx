import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormDataFields, ArbeidsforholdFormData, SøknadFormField } from '../../types/SøknadFormData';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforhold: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    const intl = useIntl();
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdFormDataFields) => `${name}.${index}.${field}`;
                return (
                    <>
                        <FormBlock>
                            <FormikYesOrNoQuestion
                                legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}
                                name={getFieldName(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] ===
                            YesOrNo.YES && (
                            <FormBlock paddingBottom={'xl'}>
                                <FormikYesOrNoQuestion
                                    legend={intlHelper(
                                        intl,
                                        'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                    )}
                                    name={getFieldName(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </FormBlock>
                        )}
                        {arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] ===
                            YesOrNo.YES && (
                            <Box margin="s" padBottom="xl">
                                <AlertStripe type="info">
                                    <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                                </AlertStripe>
                            </Box>
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
