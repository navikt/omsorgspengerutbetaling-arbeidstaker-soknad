import React, { useEffect, useState } from 'react';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { Arbeidsforhold, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikProps, useFormikContext } from 'formik';
import { Søkerdata } from '../../types/Søkerdata';
import FormikArbeidsforhold from '../../components/formik-arbeidsforhold/FormikArbeidsforhold';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import FosterbarnListAndDialog from '@navikt/sif-common-forms/lib/fosterbarn/FosterbarnListAndDialog';
import { SituasjonStepQuestions } from './config';
import SøknadFormComponents from '../SøknadFormComponents';
import { Ingress } from 'nav-frontend-typografi';

interface OwnProps {
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

type SituasjonStepViewProps = StepConfigProps & OwnProps;

const SituasjonStepView = (props: SituasjonStepViewProps) => {
    const { onValidSubmit, søkerdata, formikProps } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { values } = useFormikContext<SøknadFormData>();
    const visibility = SituasjonStepQuestions.getVisbility(values);

    useEffect(() => {
        const today = dateToday;

        const fetchData = async () => {
            if (today) {
                await getArbeidsgivere(today, today, formikProps, søkerdata);
                setIsLoading(false);
            }
        };

        if (today) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    const arbeidsforhold: Arbeidsforhold[] = values[SøknadFormField.arbeidsforhold];

    return (
        <SøknadStep id={StepID.SITUASJON} onValidFormSubmit={onValidSubmit} buttonDisabled={isLoading}>
            <>
                <Box padBottom={'xxl'}>
                    <Ingress>
                        <FormattedMessage id={'dinSituasjon.arbeidsforhold.tittel'} />
                    </Ingress>
                </Box>

                <Box padBottom="xxl">
                    <CounsellorPanel>
                        <FormattedHTMLMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html" />
                    </CounsellorPanel>
                </Box>
                {arbeidsforhold.length > 0 && (
                    <>
                        {arbeidsforhold.map((forhold, index) => (
                            <Box padBottom="xxl" key={forhold.organisasjonsnummer}>
                                <FormSection titleTag="h4" title={forhold.navn} titleIcon={<BuildingIcon />}>
                                    <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                </FormSection>
                            </Box>
                        ))}
                    </>
                )}

                {arbeidsforhold.length === 0 && (
                    <Box padBottom={'xxl'}>
                        <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />
                    </Box>
                )}

                <Box padBottom={'xxl'}>
                    <Ingress>
                        <FormattedMessage id={'dinSituasjon.fosterbarn.tittel'} />
                    </Ingress>
                </Box>

                <CounsellorPanel>
                    <FormattedHTMLMessage id="fosterbarn.legend" />
                </CounsellorPanel>

                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.har_fosterbarn}
                        legend="Har du fosterbarn?"
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>

                {visibility.isVisible(SøknadFormField.fosterbarn) && (
                    <FormBlock margin="l">
                        <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />
                    </FormBlock>
                )}
            </>
        </SøknadStep>
    );
};

export default SituasjonStepView;
