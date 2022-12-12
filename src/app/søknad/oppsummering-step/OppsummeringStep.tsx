import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Panel from 'nav-frontend-paneler';
import { Person } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import NavnOgFodselsnummerSummaryView from './components/NavnOgFodselsnummerSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import SmittevernDokumenterSummaryView from './components/SmittevernDokumenterSummaryView';
import StengtBhgSkoleDokumenterSummaryView from './components/StengtBhgSkoleDokumenterSummaryView';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { getAlleUtbetalingsperioder } from 'app/utils/arbeidsforholdUtils';
import { harFraværPgaSmittevernhensyn, harFraværPgaStengBhgSkole } from 'app/utils/periodeUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { isPending } from '@devexperts/remote-data-ts';
import { useSoknadContext } from '../SoknadContext';
import { useFormikContext } from 'formik';
import DokumenterLegeerklæringSummaryView from './components/DokumenterLegeerklæringSummaryView';
import { skalEndringeneFor2023Brukes } from '../../utils/dateUtils';

interface Props {
    søker: Person;
    apiValues?: SøknadApiData;
}

const OppsummeringStep: React.FC<Props> = ({ søker, apiValues }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const { values } = useFormikContext<SøknadFormData>();

    const alleUtbetalingsperioder = getAlleUtbetalingsperioder(values.arbeidsforhold);
    const visDokumenterSmittevern = harFraværPgaSmittevernhensyn(alleUtbetalingsperioder);
    const visDokumenterStengtBhgSkole = harFraværPgaStengBhgSkole(alleUtbetalingsperioder);
    const visLegeerklæring = skalEndringeneFor2023Brukes();

    const { fornavn, mellomnavn, etternavn, fødselsnummer } = søker;

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                <FormattedMessage id="step.oppsummering.info" />
            </CounsellorPanel>

            {apiValues === undefined && <div>Api verdier mangler</div>}

            {apiValues !== undefined && (
                <>
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
                            {(visDokumenterSmittevern || visDokumenterStengtBhgSkole || visLegeerklæring) && (
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.dokumenter.header')}>
                                    {visLegeerklæring && <DokumenterLegeerklæringSummaryView />}
                                    {visDokumenterSmittevern && <SmittevernDokumenterSummaryView />}
                                    {visDokumenterStengtBhgSkole && <StengtBhgSkoleDokumenterSummaryView />}
                                </SummarySection>
                            )}
                        </Panel>
                    </Box>

                    <Box margin="l">
                        <SoknadFormComponents.ConfirmationCheckbox
                            label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                            name={SøknadFormField.harBekreftetOpplysninger}
                            validate={getCheckedValidator()}
                        />
                    </Box>
                </>
            )}
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
