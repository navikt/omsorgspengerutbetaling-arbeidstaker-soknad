import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import intlHelper from 'common/utils/intlUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { getArbeidsgivernavn } from '../../utils/arbeidsforholdUtils';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    nameHarHattFraværHosArbeidsgiver: string;
    nameArbeidsgiverHarUtbetaltLønn: string;
}

const FormikArbeidsforholdSituasjonView: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameHarHattFraværHosArbeidsgiver,
    nameArbeidsgiverHarUtbetaltLønn,
}: Props) => {
    const intl = useIntl();
    const arbeidsgivernavn = getArbeidsgivernavn(arbeidsforholdFormData);
    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion<string, ValidationError>
                    legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm', { arbeidsgivernavn })}
                    name={nameHarHattFraværHosArbeidsgiver}
                    validate={(value) => {
                        return getYesOrNoValidator()(value)
                            ? {
                                  key: 'validation.harHattFraværHosArbeidsgiver.yesOrNoIsUnanswered',
                                  values: { arbeidsgivernavn },
                              }
                            : undefined;
                    }}
                />
            </FormBlock>
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm', {
                            arbeidsgivernavn,
                        })}
                        name={nameArbeidsgiverHarUtbetaltLønn}
                        validate={(value) => {
                            return getYesOrNoValidator()(value)
                                ? {
                                      key: 'validation.arbeidsgiverHarUtbetaltLønn.yesOrNoIsUnanswered',
                                      values: { arbeidsgivernavn },
                                  }
                                : undefined;
                        }}
                    />
                </FormBlock>
            )}
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
                arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES && (
                    <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                        </AlertStripe>
                    </Box>
                )}
        </>
    );
};

export default FormikArbeidsforholdSituasjonView;
