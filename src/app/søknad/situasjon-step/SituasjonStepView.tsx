import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AxiosResponse } from 'axios';
import { FormikProps, useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere, Søkerdata } from '../../types/Søkerdata';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import appSentryLogger from '../../utils/appSentryLogger';
import {
    checkHarKlikketJaJaPåAlle,
    checkHarKlikketNeiElleJajaBlanding,
    checkHarKlikketNeiPåAlle,
} from '../../validation/components/arbeidsforholdValidations';
import SøknadStep from '../SøknadStep';
import ArbeidsforholdSituasjon from 'app/components/formik-arbeidsforhold/ArbeidsforholdSituasjon';

interface OwnProps {
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

type SituasjonStepViewProps = StepConfigProps & OwnProps;

const SituasjonStepView = (props: SituasjonStepViewProps): React.ReactElement => {
    const { onValidSubmit, formikProps } = props;
    const { values } = useFormikContext<SøknadFormData>();
    const [isLoading, setIsLoading] = useState(true);
    const [doApiCalls, setDoApiCalls] = useState(true);

    useEffect(() => {
        const today: Date = dateToday;

        const fetchData = async (dtoday: Date): Promise<void> => {
            const maybeResponse: AxiosResponse<ArbeidsgiverResponse> | null = await getArbeidsgivere(dtoday, dtoday);
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
                appSentryLogger.logError(
                    `listeAvArbeidsgivereApiResponse invalid (SituasjonStepView). Response: ${JSON.stringify(
                        maybeResponse,
                        null,
                        4
                    )}`
                );
            }
        };

        if (today && doApiCalls) {
            fetchData(today);
            setDoApiCalls(false);
        }
    }, [doApiCalls, formikProps]);

    const arbeidsforhold: ArbeidsforholdFormData[] = values[SøknadFormField.arbeidsforhold];

    const harKlikketJaJaPåAlle = checkHarKlikketJaJaPåAlle([...arbeidsforhold]);
    const harKlikketNeiPåAlle = checkHarKlikketNeiPåAlle([...arbeidsforhold]);
    const harKlikketNeiElleJajaBlanding = checkHarKlikketNeiElleJajaBlanding([...arbeidsforhold]);

    const harIkkeMottatLønnHosEnEllerFlere =
        harKlikketJaJaPåAlle === false && harKlikketNeiPåAlle == false && harKlikketNeiElleJajaBlanding === false;

    return (
        <SøknadStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={!isLoading && harIkkeMottatLønnHosEnEllerFlere}>
            <>
                <Undertittel>
                    <FormattedMessage id={'step.situasjon.arbeidsforhold.tittel'} />
                </Undertittel>

                <Box margin="l">
                    <CounsellorPanel>
                        <p>
                            <FormattedMessage id="step.situasjon.arbeidsforhold.aktivtArbeidsforhold.info.del1" />
                        </p>
                        <p>
                            <FormattedMessage id="step.situasjon.arbeidsforhold.aktivtArbeidsforhold.info.del2" />
                        </p>
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
                    <FormBlock>
                        <div className="arbeidsforhold-liste">
                            {arbeidsforhold.map((forhold, index) => (
                                <Box padBottom="xxl" key={forhold.organisasjonsnummer}>
                                    <FormSection
                                        titleTag="h3"
                                        title={forhold.navn || forhold.organisasjonsnummer}
                                        titleIcon={<BuildingIcon />}>
                                        <ArbeidsforholdSituasjon
                                            arbeidsforhold={forhold}
                                            parentFieldName={`${SøknadFormField.arbeidsforhold}.${index}`}
                                        />
                                    </FormSection>
                                </Box>
                            ))}
                        </div>
                    </FormBlock>
                )}

                {!isLoading && arbeidsforhold.length === 0 && (
                    <FormBlock>
                        <AlertStripe type={'info'}>
                            <FormattedMessage id={'step.situasjon.arbeidsforhold.ingen.info.text'} />
                        </AlertStripe>
                    </FormBlock>
                )}

                {harKlikketJaJaPåAlle && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'step.situasjon.arbeidsforhold.ingenGjeldende.info.text.jaja'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiPåAlle && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'step.situasjon.arbeidsforhold.ingenGjeldende.info.text.nei'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiElleJajaBlanding && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'step.situasjon.arbeidsforhold.ingenGjeldende.info.text.blanding'} />
                        </AlertStripe>
                    </FormBlock>
                )}

                {harKlikketJaJaPåAlle === false &&
                    harKlikketNeiPåAlle == false &&
                    harKlikketNeiElleJajaBlanding === false}
            </>
        </SøknadStep>
    );
};

export default SituasjonStepView;
