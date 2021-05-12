import * as React from 'react';
import { useIntl } from 'react-intl';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import FormBlock from 'common/components/form-block/FormBlock';
import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { UtbetalingsperiodeApi } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from '../../utils/arbeidsforholdUtils';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';
import UtbetalingsperioderSummaryView from '../oppsummering-step/components/UtbetalingsperioderSummaryView';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';

const AnnetStepView: React.FC<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderHarVærtIUtlandet } = values;
    const intl = useIntl();

    const utbetalingsperioder: UtbetalingsperiodeApi[] = getAlleUtbetalingsperioder(values);
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
                    validate={getYesOrNoValidator()}
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
                        validate={getListValidator({ required: true })}
                    />
                </FormBlock>
            )}

            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harSøktAndreUtbetalinger}
                    legend={intlHelper(intl, 'step.fravær.har_søkt_andre_utbetalinger.spm')}
                    validate={getYesOrNoValidator()}
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
                            validate={getListValidator({ required: true })}
                        />
                    </FormBlock>
                )}
            </FormBlock>
        </SøknadStep>
    );
};

export default AnnetStepView;
