import * as React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { HvorforSøkerDuDirekte, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikRadioPanelGroup, FormikTextarea, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import { PopoverOrientering } from 'nav-frontend-popover';
import FormBlock from 'common/components/form-block/FormBlock';
import { useFormikContext } from 'formik';

const EgenutbetalingStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    // const visibility = EgenutbetalingQuestions.getVisbility(values);

    // const showSubmitButton = visibility.areAllQuestionsAnswered();

    return (
        <SøknadStep id={StepID.EGENUTBETALING} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>{intlHelper(intl, 'step.egenutbetaling.counsellorpanel.content')}</CounsellorPanel>

            <FormBlock>
                <FormikRadioPanelGroup
                    radios={[
                        {
                            label: intlHelper(intl, HvorforSøkerDuDirekte.forutForDetteArbeidsforholdet),
                            value: HvorforSøkerDuDirekte.forutForDetteArbeidsforholdet
                        },
                        {
                            label: intlHelper(intl, HvorforSøkerDuDirekte.inntektFraNav),
                            value: HvorforSøkerDuDirekte.inntektFraNav
                        },
                        {
                            label: intlHelper(intl, HvorforSøkerDuDirekte.militærtjeneste),
                            value: HvorforSøkerDuDirekte.militærtjeneste
                        },
                        {
                            label: intlHelper(intl, HvorforSøkerDuDirekte.ulønnetPermisjonDirekteEtterForeldrepenger),
                            value: HvorforSøkerDuDirekte.ulønnetPermisjonDirekteEtterForeldrepenger
                        },
                        {
                            label: intlHelper(intl, HvorforSøkerDuDirekte.lovbestemtFerie),
                            value: HvorforSøkerDuDirekte.lovbestemtFerie
                        },
                        { label: intlHelper(intl, HvorforSøkerDuDirekte.annet), value: HvorforSøkerDuDirekte.annet }
                    ]}
                    legend={
                        <LabelWithInfo
                            infoPlassering={PopoverOrientering.Over}
                            // info={"Hva slags info er dette ?"}
                        >
                            {intlHelper(intl, 'steg2.hvorforSøkerDuDirekte.legeng')}
                        </LabelWithInfo>
                    }
                    name={SøknadFormField.hvorforSøkerDuDirekte}
                    useTwoColumns={false}
                />
            </FormBlock>

            {values[SøknadFormField.hvorforSøkerDuDirekte] === HvorforSøkerDuDirekte.annet && (
                <FormBlock>
                    <FormikTextarea
                        label={intlHelper(intl, 'annet_beskrivelse_legen')}
                        name={SøknadFormField.hvorforSØkerDuDirekteAnnetBeskrivelse}
                    />
                </FormBlock>
            )}
        </SøknadStep>
    );
};

export default EgenutbetalingStep;
