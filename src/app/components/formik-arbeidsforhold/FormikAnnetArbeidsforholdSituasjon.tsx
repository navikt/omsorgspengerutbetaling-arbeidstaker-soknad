import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import { AnnetArbeidsforholdFormDataFields, SøknadFormData } from '../../types/SøknadFormData';
import { FormikInput, FormikTextarea, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import { Ingress } from 'nav-frontend-typografi';
import { getAnnetArbeidsforholdField } from '../../søknad/situasjon-step/SituasjonStepView';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    hide?: boolean;
}

const FormikAnnetArbeidsforholdSituasjon: React.FunctionComponent<Props> = ({ hide = false }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const { annetArbeidsforhold } = values;

    const skalViseArbeidsgiverHarUtbetaltLønnSpørsmål =
        annetArbeidsforhold[AnnetArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES;
    const skalViseNavnPåAnnenArbeidsgiverTextArea =
        skalViseArbeidsgiverHarUtbetaltLønnSpørsmål &&
        annetArbeidsforhold[AnnetArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO;
    const skalViseInfopanelHarUtbetalt =
        annetArbeidsforhold[AnnetArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
        annetArbeidsforhold[AnnetArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.YES;
    return (
        <FormBlock paddingBottom={'xxl'}>
            <Box padBottom={'l'}>
                <Ingress>
                    <FormattedMessage id={'annetArbeidsforhold.undertittel'} />
                </Ingress>
            </Box>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getAnnetArbeidsforholdField(AnnetArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    legend={intlHelper(intl, 'annetArbeidsforhold.harHattFravaer.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {skalViseArbeidsgiverHarUtbetaltLønnSpørsmål && (
                <FormBlock paddingBottom={'l'}>
                    <FormikYesOrNoQuestion
                        name={getAnnetArbeidsforholdField(
                            AnnetArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn
                        )}
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
                            name={getAnnetArbeidsforholdField(AnnetArbeidsforholdFormDataFields.navn)}
                        />
                    </FormBlock>
                    <Box margin="s" padBottom="xl">
                        <AlertStripe type="info">
                            <FormattedMessage id="annetArbeidsforhold.arbeidsgiverHarIkkeUtbetaltLonn.infopanel.txt" />
                        </AlertStripe>
                    </Box>
                </>
            )}
            {skalViseInfopanelHarUtbetalt && (
                <Box margin="s" padBottom="xl">
                    <AlertStripe type="info">
                        <FormattedMessage id="arbeidsforhold.harUtbetalingLønn.alertstripe" />
                    </AlertStripe>
                </Box>
            )}
        </FormBlock>
    );
};

export default FormikAnnetArbeidsforholdSituasjon;
