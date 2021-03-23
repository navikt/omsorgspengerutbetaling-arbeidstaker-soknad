import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import SmittevernInfo from '../../components/information/SmittevernInfo';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { Utbetalingsperiode } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from '../../utils/arbeidsforholdUtils';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';
import UtbetalingsperioderSummaryView from '../oppsummering-step/components/UtbetalingsperioderSummaryView';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

const AnnetStepView: React.FC<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderHarVærtIUtlandet } = values;
    const intl = useIntl();

    const utbetalingsperioder: Utbetalingsperiode[] = getAlleUtbetalingsperioder(values);
    const førsteOgSisteDagMedFravær = getPeriodeBoundaries(utbetalingsperioder);
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    const sizeOver24Mb = getTotalSizeOfAttachments(alleDokumenterISøknaden) > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadStep
            id={StepID.ANNET}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            showSubmitButton={true}
            buttonDisabled={sizeOver24Mb}>
            <FormBlock paddingBottom={'l'}>
                <ContentWithHeader header={intlHelper(intl, 'step.annet.periodeoversikt.tittel')}>
                    <UtbetalingsperioderSummaryView utbetalingsperioder={utbetalingsperioder} />
                </ContentWithHeader>
            </FormBlock>

            <FormBlock margin={'l'}>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.perioderHarVærtIUtlandet}
                    legend={intlHelper(intl, 'step.fravær.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {perioderHarVærtIUtlandet === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.perioderUtenlandsopphold}
                        minDate={førsteOgSisteDagMedFravær.min || date1YearAgo}
                        maxDate={førsteOgSisteDagMedFravær.max || dateToday}
                        labels={{
                            addLabel: intlHelper(intl, 'step.annet.periodeoversikt.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.annet.periodeoversikt.modalTittel'),
                        }}
                        validate={validateRequiredList}
                    />
                </FormBlock>
            )}
            <FormBlock paddingBottom={'l'}>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.hjemmePgaSmittevernhensynYesOrNo}
                    legend={intlHelper(intl, 'steg.en.smittevern.sporsmal')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'info.smittevern.tittel')}>
                            <SmittevernInfo />
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.hjemmePgaSmittevernhensynYesOrNo === YesOrNo.YES && (
                <>
                    <CounsellorPanel>
                        <Box padBottom={'l'}>
                            <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.1" />
                        </Box>
                        <Box padBottom={'l'}>
                            <FormattedMessage id="step.annet.hjemmePgaSmittevern.info.2" />
                        </Box>
                    </CounsellorPanel>
                    <Box margin={'l'}>
                        <PictureScanningGuide />
                    </Box>
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'steg.dokumenter.smittevernVedlegg')}
                        formikName={SøknadFormField.smittevernDokumenter}
                        dokumenter={values.smittevernDokumenter}
                        alleDokumenterISøknaden={alleDokumenterISøknaden}
                    />
                </>
            )}

            {isFeatureEnabled(Feature.STENGT_BHG_SKOLE) && (
                <>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.hjemmePgaStengtBhgSkole}
                            legend={intlHelper(intl, 'steg.annet.hjemmePgaStengt.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {values.hjemmePgaStengtBhgSkole === YesOrNo.YES && (
                        <FormBlock>
                            <CounsellorPanel>
                                <Box padBottom={'l'}>
                                    <FormattedMessage id="steg.annet.stengtBhgSkole.info.1" />
                                </Box>
                                <Box padBottom={'l'}>
                                    <FormattedMessage id="steg.annet.stengtBhgSkole.info.2" />
                                </Box>
                            </CounsellorPanel>
                            <Box margin={'l'}>
                                <PictureScanningGuide />
                            </Box>
                            <FormikVedleggsKomponent
                                uploadButtonLabel={intlHelper(intl, 'steg.annet.stengtBhgSkole.vedlegg')}
                                formikName={SøknadFormField.dokumenterStengtBkgSkole}
                                dokumenter={values.dokumenterStengtBkgSkole}
                                alleDokumenterISøknaden={alleDokumenterISøknaden}
                            />
                        </FormBlock>
                    )}
                </>
            )}

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harSøktAndreUtbetalinger}
                    legend={intlHelper(intl, 'step.fravær.har_søkt_andre_utbetalinger.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
                {values.harSøktAndreUtbetalinger === YesOrNo.YES && (
                    <FormBlock>
                        <SøknadFormComponents.CheckboxPanelGroup
                            name={SøknadFormField.andreUtbetalinger}
                            legend={intlHelper(intl, 'step.fravær.hvilke_utbetalinger.spm')}
                            checkboxes={[
                                {
                                    id: AndreUtbetalinger.dagpenger,
                                    value: AndreUtbetalinger.dagpenger,
                                    label: intlHelper(intl, 'andre_utbetalinger.dagpenger'),
                                },
                                {
                                    id: AndreUtbetalinger.sykepenger,
                                    value: AndreUtbetalinger.sykepenger,
                                    label: intlHelper(intl, 'andre_utbetalinger.sykepenger'),
                                },
                            ]}
                            validate={validateRequiredList}
                        />
                    </FormBlock>
                )}
            </FormBlock>
        </SøknadStep>
    );
};

export default AnnetStepView;
