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
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
}

const ArbeidsforholdSituasjon: React.FC<Props> = ({ arbeidsforhold, parentFieldName }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;

    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}
                    name={getFieldName(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm')}
                        name={getFieldName(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
                arbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES && (
                    <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                        </AlertStripe>
                    </Box>
                )}
        </>
    );
};

export default ArbeidsforholdSituasjon;
