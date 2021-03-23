import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { postApplication } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import { StepID } from '../../config/stepConfig';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import AndreUtbetalingerSummaryView from './components/AndreUtbetalingerSummaryView';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import SelvstendigOgEllerFrilansSummaryView from './components/SelvstendigOgEllerFrilansSummaryView';
import SmittevernSummaryView from './components/SmittevernSummaryView';
import StengtBhgSkoleSummaryView from './components/StengtBhgSkoleSummaryView';
import SummarySection from './components/summary-section/SummarySection';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';

interface Props {
    søkerdata: Søkerdata;
    onApplicationSent: (sentSuccessfully: boolean, apiValues?: SøknadApiData) => void;
}

const OppsummeringStep: React.FC<Props> = ({ onApplicationSent, søkerdata }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const { logSoknadFailed, logUserLoggedOut, logSoknadSent } = useAmplitudeInstance();
    const [sendingInProgress, setSendingInProgress] = useState(false);

    const apiValues: SøknadApiData = mapFormDataToApiData(values, intl);

    async function sendApplication(data: SøknadApiData): Promise<void> {
        setSendingInProgress(true);
        try {
            await postApplication(data);
            await logSoknadSent(SKJEMANAVN);
            onApplicationSent(true, apiValues);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                await logUserLoggedOut('Ved innsending av søknad');
                navigateToLoginPage();
            } else {
                await logSoknadFailed(SKJEMANAVN);
                onApplicationSent(false);
                appSentryLogger.logApiError(error);
            }
        }
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer },
    } = søkerdata;

    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    sendApplication(apiValues); // La view oppdatere seg først
                });
            }}
            useValidationErrorSummary={false}
            buttonDisabled={sendingInProgress}
            showButtonSpinner={sendingInProgress}>
            <CounsellorPanel>
                <FormattedMessage id="steg.oppsummering.info" />
            </CounsellorPanel>
            <Box margin="xl">
                <Panel border={true}>
                    {/* Om deg */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.omDeg')}>
                        <NavnOgFodselsnummerSummaryView
                            fornavn={fornavn || undefined}
                            etternavn={etternavn || undefined}
                            mellomnavn={mellomnavn || undefined}
                            fødselsnummer={fødselsnummer}
                        />
                    </SummarySection>

                    {/* Fravær fra arbeid */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.utbetaling.titel')}>
                        <ArbeidsforholdSummaryView listeAvArbeidsforhold={apiValues.arbeidsgivere} />
                    </SummarySection>

                    {/* Særlige smittevernhensyn */}
                    {apiValues.hjemmePgaSmittevernhensyn && (
                        <SummarySection header={intlHelper(intl, 'steg.oppsummering.smittevernhensyn.titel')}>
                            <SmittevernSummaryView dokumenterSmittevern={values.dokumenterSmittevernhensyn} />
                        </SummarySection>
                    )}

                    {/* Lokalt stengt barnehage eller skole */}
                    {apiValues.hjemmePgaStengtBhgSkole && (
                        <SummarySection header={intlHelper(intl, 'steg.oppsummering.stengtBhgSkole.bekreftelse.titel')}>
                            <StengtBhgSkoleSummaryView dokumenterStengBhgSkole={values.dokumenterStengtBkgSkole} />
                        </SummarySection>
                    )}

                    {/* Utenlandsopphold */}
                    <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />

                    {/* Andre inntekter */}
                    {(apiValues.erSelvstendig || apiValues.erFrilanser || apiValues.andreUtbetalinger.length > 0) && (
                        <SummarySection header={intlHelper(intl, 'steg.oppsummering.andreInntekter.titel')}>
                            <SelvstendigOgEllerFrilansSummaryView
                                erSelvstendig={apiValues.erSelvstendig}
                                erFrilanser={apiValues.erFrilanser}
                            />
                            <AndreUtbetalingerSummaryView andreUtbetalinger={apiValues.andreUtbetalinger} />
                        </SummarySection>
                    )}

                    {/* Medlemskap i folketrygden */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.medlemskap.header')}>
                        <MedlemskapSummaryView bosteder={apiValues.bosteder} />
                    </SummarySection>

                    {/*<VedleggSummaryView apiValues={apiValues} />*/}
                </Panel>
            </Box>

            <Box margin="l">
                <SøknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                    name={SøknadFormField.harBekreftetOpplysninger}
                    validate={(value): string | undefined =>
                        value !== true
                            ? intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet')
                            : undefined
                    }
                />
            </Box>
        </SøknadStep>
    );
};

export default OppsummeringStep;
