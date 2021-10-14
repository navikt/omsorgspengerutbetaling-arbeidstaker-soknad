import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { postApplication } from '../../api/api';
import { StepID } from '../../config/stepConfig';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import SmittevernDokumenterSummaryView from './components/SmittevernDokumenterSummaryView';
import appSentryLogger from '../../utils/appSentryLogger';
import StengtBhgSkoleDokumenterSummaryView from './components/StengtBhgSkoleDokumenterSummaryView';
import SummarySection from './components/summary-section/SummarySection';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { SKJEMANAVN } from '../../App';
import { getAlleUtbetalingsperioder } from 'app/utils/arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from 'app/utils/periodeUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
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

    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);

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
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                <FormattedMessage id="step.oppsummering.info" />
            </CounsellorPanel>
            <Box margin="xl">
                <Panel border={true}>
                    {/* Om deg */}
                    <SummarySection header={intlHelper(intl, 'step.oppsummering.søker.omDeg')}>
                        <NavnOgFodselsnummerSummaryView
                            fornavn={fornavn || undefined}
                            etternavn={etternavn || undefined}
                            mellomnavn={mellomnavn || undefined}
                            fødselsnummer={fødselsnummer}
                        />
                    </SummarySection>

                    {/* Fravær fra arbeid */}
                    <SummarySection header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.titel')}>
                        <ArbeidsforholdSummaryView listeAvArbeidsforhold={apiValues.arbeidsgivere} />
                    </SummarySection>

                    {/* Utenlandsopphold */}
                    <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />

                    {/* Medlemskap i folketrygden */}
                    <SummarySection header={intlHelper(intl, 'step.oppsummering.medlemskap.header')}>
                        <MedlemskapSummaryView bosteder={apiValues.bosteder} />
                    </SummarySection>

                    {/* Vedlegg */}
                    {(visDokumenterSmittevern || visDokumenterStengtBhgSkole) && (
                        <SummarySection header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                            {visDokumenterSmittevern && <SmittevernDokumenterSummaryView />}
                            {visDokumenterStengtBhgSkole && <StengtBhgSkoleDokumenterSummaryView />}
                        </SummarySection>
                    )}
                </Panel>
            </Box>

            <Box margin="l">
                <SøknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                    name={SøknadFormField.harBekreftetOpplysninger}
                    validate={getCheckedValidator()}
                />
            </Box>
        </SøknadStep>
    );
};

export default OppsummeringStep;
