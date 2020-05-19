import React, { useEffect, useState } from 'react';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikProps, useFormikContext } from 'formik';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere, Søkerdata } from '../../types/Søkerdata';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import FormBlock from 'common/components/form-block/FormBlock';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import FosterbarnListAndDialog from '@navikt/sif-common-forms/lib/fosterbarn/FosterbarnListAndDialog';
import SøknadFormComponents from '../SøknadFormComponents';
import { Undertittel } from 'nav-frontend-typografi';
import { AxiosResponse } from 'axios';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { YesOrNo } from 'common/types/YesOrNo';
import { logToSentryOrConsole } from '../../utils/sentryUtils';
import { Severity } from '@sentry/types';
import FormikArbeidsforholdDelEn from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelEn';
import FormikAnnetArbeidsforholdSituasjon from '../../components/formik-arbeidsforhold/FormikAnnetArbeidsforholdSituasjon';
import AlertStripe from 'nav-frontend-alertstriper';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import {
    checkHarKlikketJaJaPåAlle,
    checkHarKlikketNeiElleJajaBlanding,
    checkHarKlikketNeiPåAlle,
    harIngenGjeldendeArbeidsforholdOgAlleSpørsmålErBesvart
} from '../../validation/components/arbeidsforholdValidations';

interface OwnProps {
    søkerdata: Søkerdata;
    formikProps: FormikProps<SøknadFormData>;
}

type SituasjonStepViewProps = StepConfigProps & OwnProps;

const SituasjonStepView = (props: SituasjonStepViewProps) => {
    const { onValidSubmit, formikProps } = props;
    const [isLoading, setIsLoading] = useState(true);
    const { values, errors, isValid } = useFormikContext<SøknadFormData>();
    const [doApiCalls, setDoApiCalls] = useState<boolean>(true);

    useEffect(() => {
        const today: Date = dateToday;

        const fetchData = async (dtoday: Date) => {
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
                logToSentryOrConsole(
                    `listeAvArbeidsgivereApiResponse invalid (SituasjonStepView). Response: ${JSON.stringify(
                        maybeResponse,
                        null,
                        4
                    )}`,
                    Severity.Critical
                );
            }
        };

        if (today && doApiCalls) {
            fetchData(today);
            setDoApiCalls(false);
        }
    }, [doApiCalls]);

    const arbeidsforhold: ArbeidsforholdFormData[] = values[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold: ArbeidsforholdFormData = values[SøknadFormField.annetArbeidsforhold];

    const skalViseAdvarselOgDisableFortsettKnapp = harIngenGjeldendeArbeidsforholdOgAlleSpørsmålErBesvart([
        ...arbeidsforhold,
        annetArbeidsforhold
    ]);

    const harKlikketJaJaPåAlle = checkHarKlikketJaJaPåAlle([...arbeidsforhold, annetArbeidsforhold]);
    const harKlikketNeiPåAlle = checkHarKlikketNeiPåAlle([...arbeidsforhold, annetArbeidsforhold]);
    const harKlikketNeiElleJajaBlanding = checkHarKlikketNeiElleJajaBlanding([...arbeidsforhold, annetArbeidsforhold]);

    const disableFortsettButton = harKlikketJaJaPåAlle || harKlikketNeiPåAlle || harKlikketNeiElleJajaBlanding;

    return (
        <SøknadStep
            id={StepID.SITUASJON}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading || disableFortsettButton}>
            <>
                <Box padBottom={'xxl'}>
                    <Undertittel>
                        <FormattedMessage id={'dinSituasjon.arbeidsforhold.tittel'} />
                    </Undertittel>
                </Box>

                <Box padBottom="xxl">
                    <CounsellorPanel>
                        <Box padBottom={'l'}>
                            <FormattedHTMLMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html.del1" />
                        </Box>
                        <Box>
                            <FormattedHTMLMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html.del2" />
                        </Box>
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
                                <FormSection
                                    titleTag="h4"
                                    title={forhold.navn || forhold.organisasjonsnummer}
                                    titleIcon={<BuildingIcon />}>
                                    <FormikArbeidsforholdDelEn arbeidsforholdFormData={forhold} index={index} />
                                </FormSection>
                            </Box>
                        ))}
                    </>
                )}

                {!isLoading && arbeidsforhold.length === 0 && (
                    <FormBlock>
                        <AlertStripe type={'info'}>
                            <FormattedHTMLMessage id={'ingen.arbeidsforhold.info.text'} />
                        </AlertStripe>
                    </FormBlock>
                )}

                {/* ANNET ARBEIDSFORHOLD*/}
                <FormikAnnetArbeidsforholdSituasjon />

                {/* FOSTERBARN */}

                <Box padBottom={'xxl'}>
                    <Undertittel>
                        <FormattedMessage id={'dinSituasjon.fosterbarn.tittel'} />
                    </Undertittel>
                </Box>

                <CounsellorPanel>
                    <FormattedHTMLMessage id="fosterbarn.legend" />
                </CounsellorPanel>

                <FormBlock paddingBottom={'xxl'}>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.harFosterbarn}
                        legend="Har du fosterbarn?"
                        validate={validateYesOrNoIsAnswered}
                    />

                    {values[SøknadFormField.harFosterbarn] === YesOrNo.YES && (
                        <FormBlock margin="l">
                            <FosterbarnListAndDialog
                                name={SøknadFormField.fosterbarn}
                                validate={validateRequiredList}
                            />
                        </FormBlock>
                    )}
                </FormBlock>

                {/*/!* Info og advarseler *!/*/}
                {/*{skalViseAdvarselOgDisableFortsettKnapp && (*/}
                {/*    <FormBlock paddingBottom={'l'}>*/}
                {/*        <AlertStripe type={'advarsel'}>*/}
                {/*            <FormattedHTMLMessage id={'ingen.gjeldende.arbeidsforhold.info.text'} />*/}
                {/*        </AlertStripe>*/}
                {/*    </FormBlock>*/}
                {/*)}*/}

                {harKlikketJaJaPåAlle && (
                    <FormBlock paddingBottom={'l'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedHTMLMessage id={'ingen.gjeldende.arbeidsforhold.info.text.jaja'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiPåAlle && (
                    <FormBlock paddingBottom={'l'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedHTMLMessage id={'ingen.gjeldende.arbeidsforhold.info.text.nei'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiElleJajaBlanding && (
                    <FormBlock paddingBottom={'l'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedHTMLMessage id={'ingen.gjeldende.arbeidsforhold.info.text.blanding'} />
                        </AlertStripe>
                    </FormBlock>
                )}
            </>
        </SøknadStep>
    );
};

export default SituasjonStepView;
