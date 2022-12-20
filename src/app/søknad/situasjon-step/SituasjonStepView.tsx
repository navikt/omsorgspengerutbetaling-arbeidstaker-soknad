import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AxiosResponse } from 'axios';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere, Person } from '../../types/Søkerdata';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import appSentryLogger from '../../utils/appSentryLogger';
import {
    checkHarKlikketJaJaPåAlle,
    checkHarKlikketNeiElleJajaBlanding,
    checkHarKlikketNeiPåAlle,
} from '../../validation/components/arbeidsforholdValidations';
import ArbeidsforholdSituasjon from '../../components/formik-arbeidsforhold/ArbeidsforholdSituasjon';
import ArbeidsforholdUtbetalingsårsak from '../../components/formik-arbeidsforhold/ArbeidsforholdUtbetalingsårsak';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { valuesToAlleDokumenterISøknaden } from 'app/utils/attachmentUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

interface Props {
    søker: Person;
    soknadId: string;
}

const SituasjonStepView: React.FC<Props> = ({ søker, soknadId }: Props) => {
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();
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
                    values[SøknadFormField.arbeidsforhold]
                );
                if (updatedArbeidsforholds.length > 0) {
                    setFieldValue(SøknadFormField.arbeidsforhold, updatedArbeidsforholds);
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
    }, [doApiCalls, setFieldValue, values]);

    const arbeidsforhold: ArbeidsforholdFormData[] = values[SøknadFormField.arbeidsforhold];
    const harKlikketJaJaPåAlle = checkHarKlikketJaJaPåAlle([...arbeidsforhold]);
    const harKlikketNeiPåAlle = checkHarKlikketNeiPåAlle([...arbeidsforhold]);
    const harKlikketNeiElleJajaBlanding = checkHarKlikketNeiElleJajaBlanding([...arbeidsforhold]);

    const harIkkeMottatLønnHosEnEllerFlere =
        harKlikketJaJaPåAlle === false && harKlikketNeiPåAlle === false && harKlikketNeiElleJajaBlanding === false;

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    const attachmentsSizeOver24Mb =
        getTotalSizeOfAttachments(alleDokumenterISøknaden) > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.SITUASJON}
            showSubmitButton={!isLoading && harIkkeMottatLønnHosEnEllerFlere}
            buttonDisabled={attachmentsSizeOver24Mb}>
            <>
                <Box margin="l">
                    <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
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
                    <FormBlock margin="xxl">
                        <div className="arbeidsforhold-liste">
                            {arbeidsforhold.map((forhold, index) => (
                                <Box padBottom="l" key={forhold.organisasjonsnummer}>
                                    <FormSection
                                        titleTag="h2"
                                        title={forhold.navn || forhold.organisasjonsnummer}
                                        titleIcon={<BuildingIcon />}>
                                        <ArbeidsforholdSituasjon
                                            arbeidsforhold={forhold}
                                            parentFieldName={`${SøknadFormField.arbeidsforhold}.${index}`}
                                        />
                                        {forhold.harHattFraværHosArbeidsgiver === YesOrNo.YES &&
                                            forhold.arbeidsgiverHarUtbetaltLønn === YesOrNo.NO && (
                                                <ArbeidsforholdUtbetalingsårsak
                                                    arbeidsforhold={forhold}
                                                    parentFieldName={`${SøknadFormField.arbeidsforhold}.${index}`}
                                                    søker={søker}
                                                    soknadId={soknadId}
                                                />
                                            )}
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

                {arbeidsforhold.length > 0 && harKlikketNeiPåAlle && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'step.situasjon.arbeidsforhold.ingenGjeldende.info.text.nei'} />
                        </AlertStripe>
                    </FormBlock>
                )}
            </>
        </SoknadFormStep>
    );
};

export default SituasjonStepView;
