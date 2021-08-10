import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import intlHelper from 'common/utils/intlUtils';
import { createFieldValidationError, FieldValidationErrors } from 'common/validation/fieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';

const alleArbeidgivereUtbetalt = (
    harKlikketJaJaPåAlle: boolean,
    harKlikketNeiElleJajaBlanding: boolean
): FieldValidationResult => {
    if (harKlikketJaJaPåAlle || harKlikketNeiElleJajaBlanding) {
        return { key: 'fieldvalidation.situasjon.alleArbeidsgivereUtbetalt' };
    }
    return undefined;
};
const validerFravær = (harKlikketNeiPåAlle: boolean): FieldValidationResult => {
    if (harKlikketNeiPåAlle) {
        return { key: 'fieldvalidation.situasjon.ingenFravær' };
    }
    return undefined;
};

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    nameHarHattFraværHosArbeidsgiver: string;
    nameArbeidsgiverHarUtbetaltLønn: string;
    harKlikketJaJaPåAlle: boolean;
    harKlikketNeiPåAlle: boolean;
    harKlikketNeiElleJajaBlanding: boolean;
}

const FormikArbeidsforholdSituasjonView: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameHarHattFraværHosArbeidsgiver,
    nameArbeidsgiverHarUtbetaltLønn,
    harKlikketJaJaPåAlle,
    harKlikketNeiPåAlle,
    harKlikketNeiElleJajaBlanding,
}: Props) => {
    const intl = useIntl();

    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}
                    name={nameHarHattFraværHosArbeidsgiver}
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
                        }
                        return validerFravær(harKlikketNeiPåAlle);
                    }}
                />
            </FormBlock>
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm')}
                        name={nameArbeidsgiverHarUtbetaltLønn}
                        validate={(value: YesOrNo): FieldValidationResult => {
                            if (value === YesOrNo.UNANSWERED) {
                                return createFieldValidationError(FieldValidationErrors.påkrevd);
                            }
                            return alleArbeidgivereUtbetalt(harKlikketJaJaPåAlle, harKlikketNeiElleJajaBlanding);
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
