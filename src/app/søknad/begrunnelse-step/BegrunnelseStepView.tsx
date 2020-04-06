import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { HvorLengeJobbet, HvorLengeJobbetFordi, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikRadioPanelGroup, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import { PopoverOrientering } from 'nav-frontend-popover';
import FormBlock from 'common/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import { FieldValidationResult } from 'common/validation/types';
import FormikQuestion from '../../components/formik-question/FormikQuestion';
import Box from 'common/components/box/Box';
import { Ingress } from 'nav-frontend-typografi';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

// (answer: YesOrNo) => FieldValidationResult;

const validateRadiogroup = (value: HvorLengeJobbetFordi): FieldValidationResult => {
    return value === HvorLengeJobbetFordi.IKKE_BESVART
        ? {
              key: 'fieldvalidation.påkrevd'
          }
        : undefined;
};

const BegrunnelseStepView = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const hvorLengeJobbet: HvorLengeJobbet = values[SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver];
    const fordi: HvorLengeJobbetFordi = values[SøknadFormField.hvorLengeJobbetFordi];

    return (
        <SøknadStep id={StepID.BEGRUNNELSE} onValidFormSubmit={onValidSubmit}>
            <Box>
                <Ingress>
                    <FormattedMessage id={'dinSituasjon.ingress'} />
                </Ingress>
            </Box>
            {/*<CounsellorPanel>{intlHelper(intl, 'step.egenutbetaling.counsellorpanel.content')}</CounsellorPanel>*/}

            <FormBlock margin={'xl'}>
                <FormikQuestion
                    firstAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                        value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
                    }}
                    secondAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                        value: HvorLengeJobbet.MER_ENN_FIRE_UKER
                    }}
                    useTwoColumns={true}
                    name={SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver}
                    legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                />
            </FormBlock>

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
                <FormBlock>
                    <FormikRadioPanelGroup
                        radios={[
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.annetArbeidsforhold.label'),
                                value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD
                            },
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.andreYtelser.label'),
                                value: HvorLengeJobbetFordi.ANDRE_YTELSER
                            },
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.militærtjeneste.label'),
                                value: HvorLengeJobbetFordi.MILITÆRTJENESTE
                            },
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.lovbestemtFerie.label'),
                                value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                            },
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.ingen.label'),
                                value: HvorLengeJobbetFordi.INGEN
                            }
                        ]}
                        legend={
                            <LabelWithInfo
                                infoPlassering={PopoverOrientering.Over}
                                // info={"Hva slags info er dette ?"}
                            >
                                {intlHelper(intl, 'hvorLengeJobbet.fordi.legend')}
                            </LabelWithInfo>
                        }
                        name={SøknadFormField.hvorLengeJobbetFordi}
                        useTwoColumns={false}
                        validate={validateRadiogroup}
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                <FormBlock>
                    <CounsellorPanel>
                        <FormattedHTMLMessage id={'hvorLengeJobbet.merEnnFire.counsellor.html'} />
                    </CounsellorPanel>
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && fordi === HvorLengeJobbetFordi.INGEN && (
                <FormBlock>
                    <AlertStripeFeil>
                        For at du som arbeidstaker skal ha rett til utbetaling av omsorgspenger fra NAV, må det være én
                        av situasjonene over som gjelder.
                    </AlertStripeFeil>
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default BegrunnelseStepView;
