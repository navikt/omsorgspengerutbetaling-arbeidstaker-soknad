import * as React from 'react';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import FormBlock from 'common/components/form-block/FormBlock';
import SøknadFormComponents from '../SøknadFormComponents';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { useFormikContext } from 'formik';
import { useIntl } from 'react-intl';
import SøknadStep from '../SøknadStep';

const AnnetStepView: React.FC<StepConfigProps> = ({ onValidSubmit }) => {

    const { values, validateField, validateForm } = useFormikContext<SøknadFormData>();
    const { perioder_harVærtIUtlandet } = values;
    const intl = useIntl();

    return (
            <SøknadStep
                id={StepID.ANNET}
                onValidFormSubmit={() => {
                    onValidSubmit();
                }}
                // cleanupStep={cleanupStep}
                showSubmitButton={true}
            >
                <FormBlock margin={'xl'}>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.perioder_harVærtIUtlandet}
                        legend={intlHelper(
                            intl,
                            'step.periode.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                        )}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
                {perioder_harVærtIUtlandet === YesOrNo.YES && (
                    <FormBlock margin="l">
                        <BostedUtlandListAndDialog<SøknadFormField>
                            name={SøknadFormField.perioder_utenlandsopphold}
                            minDate={date1YearAgo}
                            maxDate={dateToday}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                modalTitle: 'Utenlandsopphold siste 12 måneder'
                            }}
                            validate={validateRequiredList}
                        />
                    </FormBlock>
                )}
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.har_søkt_andre_utbetalinger}
                        legend={intlHelper(intl, 'step.periode.har_søkt_andre_utbetalinger.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                    {values.har_søkt_andre_utbetalinger === YesOrNo.YES && (
                        <FormBlock>
                            <SøknadFormComponents.CheckboxPanelGroup
                                name={SøknadFormField.andre_utbetalinger}
                                legend={intlHelper(intl, 'step.periode.hvilke_utbetalinger.spm')}
                                checkboxes={[
                                    {
                                        id: AndreUtbetalinger.dagpenger,
                                        value: AndreUtbetalinger.dagpenger,
                                        label: intlHelper(intl, 'andre_utbetalinger.dagpenger')
                                    },
                                    {
                                        id: AndreUtbetalinger.sykepenger,
                                        value: AndreUtbetalinger.sykepenger,
                                        label: intlHelper(intl, 'andre_utbetalinger.sykepenger')
                                    }
                                ]}
                                validate={validateRequiredList}
                            />
                        </FormBlock>
                    )}
                </FormBlock>
            </SøknadStep>
    )
};

export default AnnetStepView;