import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    SøknadFormData,
    SøknadFormField
} from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import './periodeStep.less';
import FormBlock from 'common/components/form-block/FormBlock';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikArbeidsforholdDelTrePeriodeView
    from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import FormikArbeidsforholdDelToArbeidslengde
    from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import FormSection from 'common/components/form-section/FormSection';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import { YesOrNo } from 'common/types/YesOrNo';

// TODO: Flytte utility function et passende sted ?
export const harHattFraværFraJobbOgArbeidsgiverHarIkkeUtbetaltOmsorgspenger = (
    arbeidsforholdFormData: ArbeidsforholdFormData
): boolean => {
    if (
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver] === YesOrNo.YES &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.arbeidsgiverHarUtbetaltLønn] === YesOrNo.NO
    ) {
        return true;
    } else {
        return false;
    }
};

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values, validateField, validateForm } = useFormikContext<SøknadFormData>();

    // TODO: Må implementeres på en annen måte
    // const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO && harDagerMedDelvisFravær === YesOrNo.NO;

    // TODO: CleanupStep, implementer
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

            {values[SøknadFormField.arbeidsforhold]
                .filter((arbeidsforhold: ArbeidsforholdFormData) => {
                    return harHattFraværFraJobbOgArbeidsgiverHarIkkeUtbetaltOmsorgspenger(arbeidsforhold);
                })
                .map((arbeidsforhold: ArbeidsforholdFormData, index) => (
                    <FormBlock paddingBottom={'xl'} key={arbeidsforhold.organisasjonsnummer}>
                        <FormSection
                            titleTag="h4"
                            title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer}
                            titleIcon={<BuildingIcon />}>
                            <FormikArbeidsforholdDelToArbeidslengde
                                arbeidsforholdFormData={arbeidsforhold}
                                index={index}
                            />
                            <FormikArbeidsforholdDelTrePeriodeView
                                arbeidsforholdFormData={arbeidsforhold}
                                index={index}
                            />
                        </FormSection>
                    </FormBlock>
                ))}
        </SøknadStep>
    );
};

export default PeriodeStep;
