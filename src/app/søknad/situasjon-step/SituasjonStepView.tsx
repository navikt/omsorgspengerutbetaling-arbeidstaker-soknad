import React, { useEffect, useState } from 'react';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikProps, useFormikContext } from 'formik';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere, Søkerdata } from '../../types/Søkerdata';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import FosterbarnListAndDialog from '@navikt/sif-common-forms/lib/fosterbarn/FosterbarnListAndDialog';
import SøknadFormComponents from '../SøknadFormComponents';
import { Ingress } from 'nav-frontend-typografi';
import { AxiosResponse } from 'axios';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from 'common/types/YesOrNo';
import { logToSentryOrConsole } from '../../utils/sentryUtils';
import { Severity } from '@sentry/types';
import FormikArbeidsforholdDelEn from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelEn';

interface OwnProps {
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

type SituasjonStepViewProps = StepConfigProps & OwnProps;

const SituasjonStepView = (props: SituasjonStepViewProps) => {
    const { onValidSubmit, formikProps } = props;
    const [isLoading, setIsLoading] = useState(true);
    const { values } = useFormikContext<SøknadFormData>();
    const [doApiCalls, setDoApiCalls] = useState<boolean>(true);


    useEffect(() => {
        const today: Date = dateToday;

        const fetchData = async () => {
            if (today) {
                const maybeResponse: AxiosResponse<ArbeidsgiverResponse> | null = await getArbeidsgivere(today, today);

                const maybeArbeidsgivere: Arbeidsgiver[] | undefined = maybeResponse?.data?.organisasjoner;

                if (isArbeidsgivere(maybeArbeidsgivere)) {
                    const arbeidsgivere = maybeArbeidsgivere;
                    const updatedArbeidsforholds: ArbeidsforholdFormData[] = syncArbeidsforholdWithArbeidsgivere(
                        arbeidsgivere,
                        formikProps.values[SøknadFormField.arbeidsforhold]
                    );
                    if (updatedArbeidsforholds.length > 0) {
                        formikProps.setFieldValue(SøknadFormField.arbeidsforhold, updatedArbeidsforholds);
                    }
                    setIsLoading(false);

                } else {
                    // TODO: Legg på expected og received
                    logToSentryOrConsole(
                        "listeAvArbeidsgivereApiResponse invalid (SituasjonStepView)",
                        Severity.Error
                    );
                }
            }
        };

        if (today && doApiCalls) {
            fetchData();
            setDoApiCalls(false)
        }
    }, [doApiCalls]);

    const arbeidsforhold: ArbeidsforholdFormData[] = values[SøknadFormField.arbeidsforhold];

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

                {/* ARBEIDSFORHOLD */}
                {isLoading && (
                    <div
                        style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
                        <LoadingSpinner type="XXL" />
                    </div>
                )}


                {!isLoading && arbeidsforhold.length > 0 && (
                    <>
                        {arbeidsforhold.map((forhold, index) => (
                            <Box padBottom="xxl" key={forhold.organisasjonsnummer}>
                                <FormSection titleTag="h4" title={forhold.navn || forhold.organisasjonsnummer} titleIcon={<BuildingIcon />}>
                                    <FormikArbeidsforholdDelEn arbeidsforholdFormData={forhold} index={index} />
                                </FormSection>
                            </Box>
                        ))}
                    </>
                )}

                {!isLoading && arbeidsforhold.length === 0 && (
                    <Box padBottom={'xxl'}>
                        <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />
                    </Box>
                )}

                {/* ANNET ARBEIDSFORHOLD*/}

                {/* TODO: LEGG INN KOMPONENENTER*/}

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
                        name={SøknadFormField.harFosterbarn}
                        legend="Har du fosterbarn?"
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>

                {values[SøknadFormField.harFosterbarn] === YesOrNo.YES && (
                    <FormBlock margin="l">
                        <FosterbarnListAndDialog name={SøknadFormField.fosterbarn} validate={validateRequiredList} />
                    </FormBlock>
                )}
            </>
        </SøknadStep>
    );
};

export default SituasjonStepView;
