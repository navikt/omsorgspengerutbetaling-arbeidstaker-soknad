import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { SøknadFormData } from '../../types/SøknadFormData';
import { FormikInput, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import {
    createFieldValidationError,
    FieldValidationErrors,
    validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import { Undertittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { FieldValidationResult } from 'common/validation/types';
import { getAnnetArbeidsforholdField } from '../../utils/arbeidsforholdUtils';

const validateInputField = (value: string): FieldValidationResult => {
    // TODO: Valideringsfeil dukker ikke opp i boksen neders med link til feil
    if (value && value.length > 0) {
        return undefined;
    } else {
        return createFieldValidationError(FieldValidationErrors.påkrevd);
    }
};

const FormikAnnetArbeidsforholdSituasjon: React.FunctionComponent = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const { annetArbeidsforhold } = values;

    const skalViseArbeidsgiverHarUtbetaltLønnSpørsmål =
        annetArbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES;
    const skalViseNavnPåAnnenArbeidsgiverTextArea =
        skalViseArbeidsgiverHarUtbetaltLønnSpørsmål &&
        annetArbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO;
    const skalViseInfopanelHarUtbetalt =
        annetArbeidsforhold[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
        annetArbeidsforhold[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES;

    return (
        <FormBlock paddingBottom={'l'}>
            <Box padBottom={'l'}>
                <Undertittel>
                    <FormattedMessage id={'annetArbeidsforhold.undertittel'} />
                </Undertittel>
            </Box>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    legend={intlHelper(intl, 'annetArbeidsforhold.harHattFravaer.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {skalViseArbeidsgiverHarUtbetaltLønnSpørsmål && (
                <FormBlock paddingBottom={'l'}>
                    <FormikYesOrNoQuestion
                        name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                        legend={intlHelper(intl, 'annetArbeidsforhold.ikkeUtbetaltLonn.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {skalViseNavnPåAnnenArbeidsgiverTextArea && (
                <>
                    <FormBlock paddingBottom={'l'}>
                        <FormikInput
                            label={intlHelper(
                                intl,
                                'annetArbeidsforhold.arbeidsgiverHarIkkeUtbetaltLonn.navnArbeidsgiver.spm'
                            )}
                            bredde={'XXL'}
                            name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.navn)}
                            validate={validateInputField}
                        />
                    </FormBlock>
                    <Box margin="s" padBottom="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="annetArbeidsforhold.arbeidsgiverHarIkkeUtbetaltLonn.infopanel.txt" />
                        </AlertStripe>
                    </Box>
                </>
            )}
            {skalViseInfopanelHarUtbetalt && (
                <Box margin="s" padBottom="l">
                    <AlertStripe type="info">
                        <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                    </AlertStripe>
                </Box>
            )}
        </FormBlock>
    );
};

export default FormikAnnetArbeidsforholdSituasjon;
