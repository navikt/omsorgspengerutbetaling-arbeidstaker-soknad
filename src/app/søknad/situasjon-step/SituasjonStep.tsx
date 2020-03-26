import * as React from 'react';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import FormikNBarnQuestion, { validateNBarnIsAnswered } from '../../components/formik-n-barn/FormikNBarnQuestion';

// function isYesOrNo(value: YesOrNo): boolean {
//     return value === YesOrNo.YES || value === YesOrNo.NO;
// }

const HvaErDinSituasjon = ({ onValidSubmit }: StepConfigProps) => {
    // const { values } = useFormikContext<SøknadFormData>();
    // const visibility = SituasjonStepQuestions.getVisbility(values);
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
            // showSubmitButton={visibility.areAllQuestionsAnswered()}
        >
            <CounsellorPanel>
                <p>{intlHelper(intl, 'informasjon.nar_kan_man_fa_utbetalt')}</p>
            </CounsellorPanel>

            <FormBlock>
                <FormikNBarnQuestion
                    name={SøknadFormField.nBarn}
                    legend={intlHelper(intl, 'steg1.hvorMangeBarn')}
                    validate={validateNBarnIsAnswered}
                />
            </FormBlock>

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.stegEnSpørsmålEn}
                    legend={intlHelper(intl, 'stegEnSpørsmålEn')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.stegEnSpørsmålTo}
                    legend={intlHelper(intl, 'stegEnSpørsmålTo')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.stegEnSpørsmålTre}
                    legend={intlHelper(intl, 'stegEnSpørsmålTre')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.stegEnSpørsmålFire}
                    legend={intlHelper(intl, 'stegEnSpørsmålFire')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {/*<FormBlock>*/}
            {/*    <SøknadFormComponents.YesOrNoQuestion*/}
            {/*        name={SøknadFormField.forutForDetteArbeidsforholdet}*/}
            {/*        legend={intlHelper(intl, 'steg1.forutForDetteArbeidsforholdet')}*/}
            {/*        validate={validateYesOrNoIsAnswered}*/}
            {/*    />*/}
            {/*</FormBlock>*/}
            {/*{isYesOrNo(values[SøknadFormField.forutForDetteArbeidsforholdet]) && (*/}
            {/*    <FormBlock>*/}
            {/*        <SøknadFormComponents.YesOrNoQuestion*/}
            {/*            name={SøknadFormField.militærtjeneste}*/}
            {/*            legend={intlHelper(intl, 'steg1.militærtjeneste')}*/}
            {/*            validate={validateYesOrNoIsAnswered}*/}
            {/*        />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}
            {/*{isYesOrNo(values[SøknadFormField.militærtjeneste]) && (*/}
            {/*    <FormBlock>*/}
            {/*        <SøknadFormComponents.YesOrNoQuestion*/}
            {/*            name={SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger}*/}
            {/*            legend={intlHelper(intl, 'steg1.ulønnetPermisjonDirekteEtterForeldrepenger')}*/}
            {/*            validate={validateYesOrNoIsAnswered}*/}
            {/*        />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}
            {/*{isYesOrNo(values[SøknadFormField.ulønnetPermisjonDirekteEtterForeldrepenger]) && (*/}
            {/*    <FormBlock>*/}
            {/*        <SøknadFormComponents.YesOrNoQuestion*/}
            {/*            name={SøknadFormField.lovbestemtFerie}*/}
            {/*            legend={intlHelper(intl, 'steg1.lovbestemtFerie')}*/}
            {/*            validate={validateYesOrNoIsAnswered}*/}
            {/*        />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}
            {/*{isYesOrNo(values[SøknadFormField.lovbestemtFerie]) && (*/}
            {/*    <FormBlock>*/}
            {/*        <SøknadFormComponents.YesOrNoQuestion*/}
            {/*            name={SøknadFormField.annet}*/}
            {/*            legend={intlHelper(intl, 'steg1.annet')}*/}
            {/*            validate={validateYesOrNoIsAnswered}*/}
            {/*        />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}

            {/*{visibility.isVisible(SøknadFormField.fosterbarn) && (*/}
            {/*    <FormBlock margin="l">*/}
            {/*        <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />*/}
            {/*    </FormBlock>*/}
            {/*)}*/}
        </SøknadStep>
    );
};

export default HvaErDinSituasjon;
