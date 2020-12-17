import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

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

    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}
                    name={nameHarHattFraværHosArbeidsgiver}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm')}
                        name={nameArbeidsgiverHarUtbetaltLønn}
                        validate={validateYesOrNoIsAnswered}
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
