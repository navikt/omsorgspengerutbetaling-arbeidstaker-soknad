import * as React from 'react';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { SituasjonStepQuestions } from './config';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikNBarnQuestion, { validateNBarnIsAnswered } from '../../components/formik-n-barn/FormikNBarnQuestion';

function isYesOrNo(value: YesOrNo): boolean {
    return value === YesOrNo.YES || value === YesOrNo.NO;
}



const HvaErDinSituasjon = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = SituasjonStepQuestions.getVisbility(values);
    const intl = useIntl();

    // const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
    //     const { har_fosterbarn } = values;
    //     const cleanedValues = { ...valuesToBeCleaned };
    //     if (har_fosterbarn === YesOrNo.NO) {
    //         cleanedValues.fosterbarn = [];
    //     }
    //     return cleanedValues;
    // };

    return (
        <SøknadStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            // cleanupStep={cleanupStep}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            <CounsellorPanel>
                <p>{intlHelper(intl, 'informasjon.nar_kan_man_fa_utbetalt')}</p>
            </CounsellorPanel>

            <FormikNBarnQuestion
                name={SøknadFormField.nBarn}
                legend={intlHelper(intl, 'steg1.hvorMangeBarn')}
                validate={validateNBarnIsAnswered}
            />

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.forutForDetteArbeidsforholdet}
                    legend={intlHelper(intl, 'steg1.forutForDetteArbeidsforholdet')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {isYesOrNo(values[SøknadFormField.forutForDetteArbeidsforholdet]) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.militærtjeneste}
                        legend={intlHelper(intl, 'steg1.militærtjeneste')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {isYesOrNo(values[SøknadFormField.militærtjeneste]) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger}
                        legend={intlHelper(intl, 'steg1.ulønnetPermisjonDirekteEtterForeldrepenger')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {isYesOrNo(values[SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger]) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.lovbestemtFerie}
                        legend={intlHelper(intl, 'steg1.lovbestemtFerie')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {isYesOrNo(values[SøknadFormField.lovbestemtFerie]) && (
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.annet}
                        legend={intlHelper(intl, 'steg1.annet')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}

            {/*{visibility.isVisible(SøknadFormField.fosterbarn) && (*/}
            {/*    <FormBlock margin="l">*/}
            {/*        <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}
        </SøknadStep>
    );
};

export default HvaErDinSituasjon;
