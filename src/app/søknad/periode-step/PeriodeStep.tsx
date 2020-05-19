import * as React from 'react';
import { isString, useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import './periodeStep.less';
import FormBlock from 'common/components/form-block/FormBlock';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikArbeidsforholdDelTrePeriodeView from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import FormikArbeidsforholdDelToArbeidslengde from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import FormSection from 'common/components/form-section/FormSection';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FormikAnnetArbeidsforholdStegTo from '../../components/formik-arbeidsforhold/FormikAnnetArbeidsforholdStegTo';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage } from 'react-intl';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import { YesOrNo } from 'common/types/YesOrNo';

const cleanPerioderForArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
    return {
        ...arbeidsforhold,
        perioderMedFravær:
            arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær],
        dagerMedDelvisFravær:
            arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
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
        annetArbeidsforhold: cleanPerioderForArbeidsforhold(annetArbeidsforhold)
    };
};

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const { values } = useFormikContext<SøknadFormData>();

    const annetArbeidsforhold: ArbeidsforholdFormData = values[SøknadFormField.annetArbeidsforhold];
    const annetArbeidsforholdName: string | null = annetArbeidsforhold[ArbeidsforholdFormDataFields.navn];

    const arbeidsforholdElementListe = values[SøknadFormField.arbeidsforhold].map(
        (arbeidsforhold: ArbeidsforholdFormData, index) => {
            return skalInkludereArbeidsforhold(arbeidsforhold) ? (
                <FormBlock paddingBottom={'xl'} key={arbeidsforhold.organisasjonsnummer}>
                    <FormSection
                        titleTag="h4"
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
            id={StepID.PERIODE}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={true}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedHTMLMessage id={'steg2.arbeidslengdeOgPerioder.infopanel.del1'} />
                    </Box>
                    <Box>
                        <FormattedHTMLMessage id={'steg2.arbeidslengdeOgPerioder.infopanel.del2'} />
                    </Box>
                </CounsellorPanel>
            </FormBlock>

            {arbeidsforholdElementListe.length > 0 && arbeidsforholdElementListe}

            {skalInkludereArbeidsforhold(annetArbeidsforhold) && isString(annetArbeidsforholdName) && (
                <>
                    <FormikAnnetArbeidsforholdStegTo
                        annetArbeidsforhold={annetArbeidsforhold}
                        annetArbeidsforholdName={annetArbeidsforholdName}
                    />
                </>
            )}
        </SøknadStep>
    );
};

export default PeriodeStep;
