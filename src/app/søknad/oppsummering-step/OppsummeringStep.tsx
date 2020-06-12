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
import FosterbarnSummaryView from './components/FosterbarnSummaryView';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import AndreUtbetalingerSummaryView from './components/AndreUtbetalingerSummaryView';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import SmittevernSummaryView from './components/SmittevernSummaryView';
import appSentryLogger from '../../utils/appSentryLogger';

interface Props {
    søkerdata: Søkerdata;
    onApplicationSent: (sentSuccessfully: boolean, apiValues?: SøknadApiData) => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({ onApplicationSent, søkerdata }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    // const apiValues = mock1;
    const apiValues: SøknadApiData = mapFormDataToApiData(values, intl);
    const fosterbarn = apiValues.fosterbarn || [];

    async function sendApplication(data: SøknadApiData): Promise<void> {
        setSendingInProgress(true);
        try {
            await postApplication(data);
            onApplicationSent(true, apiValues);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                onApplicationSent(false);
                appSentryLogger.logApiError(error);
            }
        }
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer }
    } = søkerdata;

    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={(): void => {
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
                    <NavnOgFodselsnummerSummaryView
                        intl={intl}
                        fornavn={fornavn || undefined}
                        etternavn={etternavn || undefined}
                        mellomnavn={mellomnavn || undefined}
                        fødselsnummer={fødselsnummer}
                    />
                    <FosterbarnSummaryView fosterbarn={fosterbarn} />
                    <ArbeidsforholdSummaryView listeAvArbeidsforhold={apiValues.arbeidsgivere} />
                    <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />
                    <SmittevernSummaryView apiValues={apiValues} />
                    <AndreUtbetalingerSummaryView andreUtbetalinger={apiValues.andreUtbetalinger} />
                    <MedlemskapSummaryView bosteder={apiValues.bosteder} />
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
