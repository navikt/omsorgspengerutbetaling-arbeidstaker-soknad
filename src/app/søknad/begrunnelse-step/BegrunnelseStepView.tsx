import * as React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
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

    return (
        <SøknadStep id={StepID.BEGRUNNELSE} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>{intlHelper(intl, 'step.egenutbetaling.counsellorpanel.content')}</CounsellorPanel>

            <FormBlock margin={'xl'}>
                <FormikQuestion
                    firstAlternative={{
                        label: 'Mindre enn fire uker',
                        value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
                    }}
                    secondAlternative={{
                        label: 'Mer enn fire uker',
                        value: HvorLengeJobbet.MER_ENN_FIRE_UKER
                    }}
                    useTwoColumns={true}
                    name={SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver}
                    legend={'Hvor lenge har du jobbet hos den nåværende arbeidsgiveren din?'}
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
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.lovbestemtFerie.label'),
                                value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                            },
                            {
                                label: intlHelper(intl, 'hvorLengeJobbet.fordi.militærtjeneste.label'),
                                value: HvorLengeJobbetFordi.MILITÆRTJENESTE
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
        </SøknadStep>
    );
};

export default BegrunnelseStepView;
