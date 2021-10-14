import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import intlHelper from 'common/utils/intlUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { AppFieldValidationErrors } from 'app/validation/fieldValidations';

interface Props {
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
}

const ArbeidsforholdSituasjon: React.FC<Props> = ({ arbeidsforhold, parentFieldName }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;
    const arbeidsgivernavn = arbeidsforhold.navn;
    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'step.situasjon.arbeidsforhold.harHattFravær.spm')}
                    name={getFieldName(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    validate={(value) => {
                        return getYesOrNoValidator()(value)
                            ? {
                                  key: AppFieldValidationErrors.harHattFraværHosArbeidsgiver_yesOrNoIsUnanswered,
                                  values: { arbeidsgivernavn },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />
            </FormBlock>
            {arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        legend={intlHelper(
                            intl,
                            'step.situasjon.arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                        )}
                        name={getFieldName(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                        validate={(value) => {
                            return getYesOrNoValidator()(value)
                                ? {
                                      key: AppFieldValidationErrors.arbeidsgiverHarUtbetaltLønn_yesOrNoIsUnanswered,
                                      values: { arbeidsgivernavn },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </FormBlock>
            )}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
                arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES && (
                    <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="step.situasjon.arbeidsforhold.harUtbetalingLønn.alertstripe" />
                        </AlertStripe>
                    </Box>
                )}
        </>
    );
};

export default ArbeidsforholdSituasjon;
