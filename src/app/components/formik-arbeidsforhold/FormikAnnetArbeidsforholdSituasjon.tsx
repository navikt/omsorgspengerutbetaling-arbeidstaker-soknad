import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { SøknadFormData } from '../../types/SøknadFormData';
import { FormikInput, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { createFieldValidationError, FieldValidationErrors } from 'common/validation/fieldValidations';
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
    harKlikketJaJaPåAlle: boolean;
    harKlikketNeiPåAlle: boolean;
    harKlikketNeiElleJajaBlanding: boolean;
}

const FormikAnnetArbeidsforholdSituasjon: React.FC<Props> = ({
    harKlikketJaJaPåAlle,
    harKlikketNeiPåAlle,
    harKlikketNeiElleJajaBlanding,
}: Props) => {
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
        <FormBlock margin="none">
            <Undertittel>
                <FormattedMessage id={'annetArbeidsforhold.undertittel'} />
            </Undertittel>

            <FormBlock margin="l">
                <FormikYesOrNoQuestion
                    name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    legend={intlHelper(intl, 'annetArbeidsforhold.harHattFravaer.spm')}
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
                        }
                        return validerFravær(harKlikketNeiPåAlle);
                    }}
                />
            </FormBlock>
            {skalViseArbeidsgiverHarUtbetaltLønnSpørsmål && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                        legend={intlHelper(intl, 'annetArbeidsforhold.ikkeUtbetaltLonn.spm')}
                        validate={(value: YesOrNo): FieldValidationResult => {
                            if (value === YesOrNo.UNANSWERED) {
                                return createFieldValidationError(FieldValidationErrors.påkrevd);
                            }
                            return alleArbeidgivereUtbetalt(harKlikketJaJaPåAlle, harKlikketNeiElleJajaBlanding);
                        }}
                    />
                </FormBlock>
            )}
            {skalViseNavnPåAnnenArbeidsgiverTextArea && (
                <>
                    <FormBlock>
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
                    <Box margin="l">
                        <AlertStripe type="info">
                            <FormattedMessage id="annetArbeidsforhold.arbeidsgiverHarIkkeUtbetaltLonn.infopanel.txt" />
                        </AlertStripe>
                    </Box>
                </>
            )}
            {skalViseInfopanelHarUtbetalt && (
                <Box margin="l">
                    <AlertStripe type="info">
                        <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                    </AlertStripe>
                </Box>
            )}
        </FormBlock>
    );
};

export default FormikAnnetArbeidsforholdSituasjon;
