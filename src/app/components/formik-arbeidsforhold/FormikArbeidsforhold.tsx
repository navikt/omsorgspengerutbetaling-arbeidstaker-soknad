import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { Arbeidsforhold, ArbeidsforholdField, SøknadFormField } from '../../types/SøknadFormData';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';

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
                        <FormBlock>
                            <FormikYesOrNoQuestion
                                legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}
                                name={getFieldName(ArbeidsforholdField.harHattFraværHosArbeidsgiver)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        {arbeidsforhold[ArbeidsforholdField.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                            <FormBlock paddingBottom={"xl"}>
                                <FormikYesOrNoQuestion
                                    legend={intlHelper(
                                        intl,
                                        'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                    )}
                                    name={getFieldName(ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn)}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </FormBlock>
                        )}
                        {
                            arbeidsforhold[ArbeidsforholdField.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES && (
                                <Box margin="s" padBottom="xl">
                                    <AlertStripe type="info">
                                        <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                                    </AlertStripe>
                                </Box>
                            )
                        }
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
