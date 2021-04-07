/* eslint-disable react/display-name */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { isString, useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikAnnetArbeidsforholdStegTo from '../../components/formik-arbeidsforhold/FormikAnnetArbeidsforholdStegTo';
import FormikArbeidsforholdDelToArbeidslengde from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import FormikArbeidsforholdDelTrePeriodeView from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import SøknadStep from '../SøknadStep';
import './fraværStep.less';

const cleanPerioderForArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
    return {
        ...arbeidsforhold,
        fraværPerioder:
            arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværPerioder],
        fraværDager:
            arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværDager],
    };
};

const cleanupStep = (søknadFormData: SøknadFormData): SøknadFormData => {
    const listeAvArbeidsforhold = søknadFormData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = søknadFormData[SøknadFormField.annetArbeidsforhold];

    return {
        ...søknadFormData,
        arbeidsforhold: listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) =>
            cleanPerioderForArbeidsforhold(arbeidsforhold)
        ),
        annetArbeidsforhold: cleanPerioderForArbeidsforhold(annetArbeidsforhold),
    };
};

const FraværStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();

    const annetArbeidsforhold: ArbeidsforholdFormData = values[SøknadFormField.annetArbeidsforhold];
    const annetArbeidsforholdName: string | null = annetArbeidsforhold[ArbeidsforholdFormDataFields.navn];

    const arbeidsforholdElementListe = values[SøknadFormField.arbeidsforhold].map(
        (arbeidsforhold: ArbeidsforholdFormData, index) => {
            return skalInkludereArbeidsforhold(arbeidsforhold) ? (
                <FormBlock key={arbeidsforhold.organisasjonsnummer}>
                    <FormSection
                        titleTag="h2"
                        title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer}
                        titleIcon={<BuildingIcon />}>
                        <FormikArbeidsforholdDelToArbeidslengde arbeidsforholdFormData={arbeidsforhold} index={index} />
                        <FormikArbeidsforholdDelTrePeriodeView arbeidsforholdFormData={arbeidsforhold} index={index} />
                    </FormSection>
                </FormBlock>
            ) : null;
        }
    );

    return (
        <SøknadStep
            id={StepID.FRAVÆR}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={true}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id={'steg2.arbeidslengdeOgPerioder.infopanel.del1'} />
                    </Box>
                    <Box>
                        <FormattedMessage
                            id={'steg2.arbeidslengdeOgPerioder.infopanel.del2'}
                            values={{ strong: (msg: string): React.ReactNode => <strong>{msg}</strong> }}
                        />
                    </Box>
                </CounsellorPanel>
            </FormBlock>
            {arbeidsforholdElementListe.length > 0 && (
                <FormBlock paddingBottom="l">
                    <div className="arbeidsforhold-liste">{arbeidsforholdElementListe}</div>
                </FormBlock>
            )}
            {skalInkludereArbeidsforhold(annetArbeidsforhold) && isString(annetArbeidsforholdName) && (
                <FormikAnnetArbeidsforholdStegTo
                    annetArbeidsforhold={annetArbeidsforhold}
                    annetArbeidsforholdName={annetArbeidsforholdName}
                />
            )}
        </SøknadStep>
    );
};

export default FraværStep;
