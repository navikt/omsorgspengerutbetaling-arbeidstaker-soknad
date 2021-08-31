/* eslint-disable react/display-name */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import { YesOrNo } from 'common/types/YesOrNo';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { valuesToAlleDokumenterISøknaden } from 'app/utils/attachmentUtils';
import FormikArbeidsforholdDelToArbeidslengde from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import FormikArbeidsforholdDelTrePeriodeView from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import SøknadStep from '../SøknadStep';
import './periodeStep.less';

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

    return {
        ...søknadFormData,
        arbeidsforhold: listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) =>
            cleanPerioderForArbeidsforhold(arbeidsforhold)
        ),
    };
};

const PeriodeStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    console.log(values);
    const arbeidsforholdElementListe = values[SøknadFormField.arbeidsforhold].map(
        (arbeidsforhold: ArbeidsforholdFormData, index) => {
            return skalInkludereArbeidsforhold(arbeidsforhold) ? (
                <FormSection
                    key={arbeidsforhold.organisasjonsnummer}
                    titleTag="h2"
                    title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer}
                    titleIcon={<BuildingIcon />}>
                    <FormikArbeidsforholdDelToArbeidslengde arbeidsforholdFormData={arbeidsforhold} index={index} />
                    <FormikArbeidsforholdDelTrePeriodeView arbeidsforholdFormData={arbeidsforhold} index={index} />
                </FormSection>
            ) : null;
        }
    );
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    const attachmentsSizeOver24Mb =
        getTotalSizeOfAttachments(alleDokumenterISøknaden) > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadStep
            id={StepID.PERIODE}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={true}
            buttonDisabled={attachmentsSizeOver24Mb}>
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
        </SøknadStep>
    );
};

export default PeriodeStep;
