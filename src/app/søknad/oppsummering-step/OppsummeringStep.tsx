import React, { useState } from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { sendApplication } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import { SpørsmålOgSvarSummaryView } from './components/SporsmalOgSvarSummaryView';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import JobbHosNavaerendeArbeidsgiverSummaryView from './components/JobbHosNavaerendeArbeidsgiverSummaryView';
import FosterbarnSummaryView from './components/FosterbarnSummaryView';
import SummaryBlock from './components/SummaryBlock';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import SummaryList from 'common/components/summary-list/SummaryList';

interface Props {
    onApplicationSent: (apiValues: SøknadApiData, søkerdata: Søkerdata) => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({ onApplicationSent }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const søkerdata = React.useContext(SøkerdataContext);
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function navigate(data: SøknadApiData, søker: Søkerdata) {
        setSendingInProgress(true);
        try {
            await sendApplication(data);
            onApplicationSent(apiValues, søker);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    }

    if (!søkerdata) {
        return null;
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer }
    } = søkerdata;

    // const apiValues = mock1;
    const apiValues: SøknadApiData = mapFormDataToApiData(values, intl);
    const fosterbarn = apiValues.fosterbarn || [];
    return (
        <SøknadStep
            id={StepID.OPPSUMMERING}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    navigate(apiValues, søkerdata); // La view oppdatere seg først
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
                    <JobbHosNavaerendeArbeidsgiverSummaryView data={apiValues.jobbHosNåværendeArbeidsgiver} />
                    <SpørsmålOgSvarSummaryView yesNoSpørsmålOgSvar={apiValues.spørsmål} />
                    <ArbeidsforholdSummaryView arbeidsgiverDetaljer={apiValues.arbeidsgivere} />
                    <FosterbarnSummaryView fosterbarn={fosterbarn} />
                    <UtbetalingsperioderSummaryView utbetalingsperioder={apiValues.utbetalingsperioder} />
                    {apiValues.andreUtbetalinger.length > 0 && (
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søkt_om_andre_utbetalinger')}>
                            <SummaryList
                                items={apiValues.andreUtbetalinger}
                                itemRenderer={(utbetaling) => (
                                    <span>{intlHelper(intl, `andre_utbetalinger.${utbetaling}`)}</span>
                                )}
                            />
                        </SummaryBlock>
                    )}
                    <UtenlandsoppholdISøkeperiodeSummaryView utenlandsopphold={apiValues.opphold} />
                    <MedlemskapSummaryView bosteder={apiValues.bosteder} />

                    {apiValues.vedlegg.length === 0 && apiValues.jobbHosNåværendeArbeidsgiver.merEnn4Uker && (
                        <Box margin={'s'}>
                            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                                <FormattedHTMLMessage id={'steg.oppsummering.dokumenter.ikkelastetopp'} />
                            </SummaryBlock>
                        </Box>
                    )}
                    {apiValues.vedlegg.length > 0 && (
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                            <UploadedDocumentsList includeDeletionFunctionality={false} />
                        </SummaryBlock>
                    )}
                </Panel>
            </Box>

            <Box margin="l">
                <SøknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                    name={SøknadFormField.harBekreftetOpplysninger}
                    validate={(value) => {
                        let result;
                        if (value !== true) {
                            result = intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet');
                        }
                        return result;
                    }}
                />
            </Box>
        </SøknadStep>
    );
};

export default OppsummeringStep;
