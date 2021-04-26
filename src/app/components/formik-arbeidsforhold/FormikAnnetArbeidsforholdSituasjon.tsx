import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikInput, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData } from '../../types/SøknadFormData';
import { getAnnetArbeidsforholdField } from '../../utils/arbeidsforholdUtils';

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
        <FormBlock margin="none">
            <Undertittel>
                <FormattedMessage id={'annetArbeidsforhold.undertittel'} />
            </Undertittel>

            <FormBlock margin="l">
                <FormikYesOrNoQuestion
                    name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    legend={intlHelper(intl, 'annetArbeidsforhold.harHattFravaer.spm')}
                    validate={getYesOrNoValidator()}
                />
            </FormBlock>
            {skalViseArbeidsgiverHarUtbetaltLønnSpørsmål && (
                <FormBlock>
                    <FormikYesOrNoQuestion
                        name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn)}
                        legend={intlHelper(intl, 'annetArbeidsforhold.ikkeUtbetaltLonn.spm')}
                        validate={getYesOrNoValidator()}
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
                            maxLength={100}
                            name={getAnnetArbeidsforholdField(ArbeidsforholdFormDataFields.navn)}
                            validate={getStringValidator({ required: true, maxLength: 100 })}
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
