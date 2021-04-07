import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import FormikAnnetArbeidsforholdSituasjon from '../../components/formik-arbeidsforhold/FormikAnnetArbeidsforholdSituasjon';
import FormikArbeidsforholdDelEn from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelEn';
import InformasjonOmSelvstendigOgFrilans from '../../components/informasjonSelvstendigOgFrilans/InformasjonOmSelvstendigOgFrilans';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { SelvstendigOgEllerFrilans } from '../../types/SelvstendigOgEllerFrilansTypes';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere, Søkerdata } from '../../types/Søkerdata';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import appSentryLogger from '../../utils/appSentryLogger';
import {
    checkHarKlikketJaJaPåAlle,
    checkHarKlikketNeiElleJajaBlanding,
    checkHarKlikketNeiPåAlle,
} from '../../validation/components/arbeidsforholdValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

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
    const intl = useIntl();

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
    const annetArbeidsforhold: ArbeidsforholdFormData = values[SøknadFormField.annetArbeidsforhold];

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
                <Undertittel>
                    <FormattedMessage id={'dinSituasjon.arbeidsforhold.tittel'} />
                </Undertittel>

                <Box margin="l">
                    <CounsellorPanel>
                        <p>
                            <FormattedMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.del1" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.del2" />
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
                                        <FormikArbeidsforholdDelEn arbeidsforholdFormData={forhold} index={index} />
                                    </FormSection>
                                </Box>
                            ))}
                        </div>
                    </FormBlock>
                )}

                {!isLoading && arbeidsforhold.length === 0 && (
                    <FormBlock>
                        <AlertStripe type={'info'}>
                            <FormattedMessage id={'ingen.arbeidsforhold.info.text'} />
                        </AlertStripe>
                    </FormBlock>
                )}

                {/* ANNET ARBEIDSFORHOLD*/}
                <FormikAnnetArbeidsforholdSituasjon />

                {harKlikketJaJaPåAlle && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'ingen.gjeldende.arbeidsforhold.info.text.jaja'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiPåAlle && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'ingen.gjeldende.arbeidsforhold.info.text.nei'} />
                        </AlertStripe>
                    </FormBlock>
                )}
                {harKlikketNeiElleJajaBlanding && (
                    <FormBlock paddingBottom={'xl'}>
                        <AlertStripe type={'advarsel'}>
                            <FormattedMessage id={'ingen.gjeldende.arbeidsforhold.info.text.blanding'} />
                        </AlertStripe>
                    </FormBlock>
                )}

                {/* SELVSTENDIG OG ELLER FRILANS */}

                <FormBlock margin="xxl">
                    <Undertittel>
                        <FormattedMessage id={'selvstendig_og_eller_frilans.ja_nei.undertittel'} />
                    </Undertittel>

                    <FormBlock margin="l">
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.erSelvstendigOgEllerFrilans}
                            legend={intlHelper(intl, 'selvstendig_og_eller_frilans.ja_nei.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {values[SøknadFormField.erSelvstendigOgEllerFrilans] === YesOrNo.YES && (
                        <>
                            <FormBlock margin={'m'}>
                                <SøknadFormComponents.CheckboxPanelGroup
                                    name={SøknadFormField.selvstendigOgEllerFrilans}
                                    checkboxes={[
                                        {
                                            id: SelvstendigOgEllerFrilans.selvstendig,
                                            value: SelvstendigOgEllerFrilans.selvstendig,
                                            label: intlHelper(intl, 'selvstendig_og_eller_frilans.selvstendig.label'),
                                        },
                                        {
                                            id: SelvstendigOgEllerFrilans.frilans,
                                            value: SelvstendigOgEllerFrilans.frilans,
                                            label: intlHelper(intl, 'selvstendig_og_eller_frilans.frilans.label'),
                                        },
                                    ]}
                                    validate={validateRequiredList}
                                />
                            </FormBlock>
                            <InformasjonOmSelvstendigOgFrilans
                                erSelvstendig={values.selvstendigOgEllerFrilans.includes(
                                    SelvstendigOgEllerFrilans.selvstendig
                                )}
                                erFrilanser={values.selvstendigOgEllerFrilans.includes(
                                    SelvstendigOgEllerFrilans.frilans
                                )}
                            />
                        </>
                    )}
                </FormBlock>
            </>
        </SøknadStep>
    );
};

export default SituasjonStepView;
