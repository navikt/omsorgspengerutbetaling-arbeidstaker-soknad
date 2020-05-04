import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import './periodeStep.less';
import FormBlock from 'common/components/form-block/FormBlock';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikArbeidsforholdDelTrePeriodeView from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import FormikArbeidsforholdDelToArbeidslengde
    from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import Box from 'common/components/box/Box';
import FormSection from 'common/components/form-section/FormSection';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FormikArbeidsforhold from '../../components/formik-arbeidsforhold/FormikArbeidsforhold';

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values, validateField, validateForm } = useFormikContext<SøknadFormData>();

    // TODO: Kan ikke fortsette validering
    // const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    // TODO: CleanupStep
    // const cleanupStep = (valuesToBeCleaned: SøknadFormData): SøknadFormData => {
    //     const cleanedValues = { ...valuesToBeCleaned };
    //     if (harDagerMedDelvisFravær === YesOrNo.NO) {
    //         cleanedValues.dagerMedDelvisFravær = [];
    //     }
    //     if (harPerioderMedFravær === YesOrNo.NO) {
    //         cleanedValues.perioderMedFravær = [];
    //     }
    //     return cleanedValues;
    // };

    return (
        <SøknadStep
            id={StepID.PERIODE}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            // cleanupStep={cleanupStep}
            showSubmitButton={true}>
            <FormBlock>
                <CounsellorPanel>Her legger du inn dagene du har hatt</CounsellorPanel>
            </FormBlock>

            {values[SøknadFormField.arbeidsforhold].map((arbeidsforhold: ArbeidsforholdFormData, index) => {
                return (
                        <Box padBottom="xxl" key={arbeidsforhold.organisasjonsnummer}>
                            <FormSection titleTag="h4" title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer} titleIcon={<BuildingIcon />}>
                                <FormikArbeidsforholdDelToArbeidslengde arbeidsforholdFormData={arbeidsforhold} index={index} />
                                <FormikArbeidsforholdDelTrePeriodeView arbeidsforholdFormData={arbeidsforhold} index={index} />
                            </FormSection>
                        </Box>
                );
            })}
        </SøknadStep>
    );
};

export default PeriodeStep;
