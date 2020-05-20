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
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import SøknadStep from '../SøknadStep';
import UtbetalingsperioderSummaryView from '../oppsummering-step/components/UtbetalingsperioderSummaryView';
import { Utbetalingsperiode } from '../../types/SøknadApiData';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import { mapPeriodeTilUtbetalingsperiode } from '../../utils/formToApiMaps/mapPeriodeToApiData';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import EkspanderbarPSG from '../../components/EkspanderbarPSG/EkspanderbarPSG';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import Box from 'common/components/box/Box';

const AnnetStepView: React.FC<StepConfigProps> = ({ onValidSubmit }) => {
    const { values, validateField, validateForm } = useFormikContext<SøknadFormData>();
    const { perioderHarVærtIUtlandet } = values;
    const intl = useIntl();

    const arbeidsforholdPerioder: Periode[] = values[SøknadFormField.arbeidsforhold]
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold[ArbeidsforholdFormDataFields.perioderMedFravær];
        })
        .flat();

    const arbeidsforholdDager: FraværDelerAvDag[] = values[SøknadFormField.arbeidsforhold]
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold[ArbeidsforholdFormDataFields.dagerMedDelvisFravær];
        })
        .flat();

    const annetPeriode: Periode[] =
        values[SøknadFormField.annetArbeidsforhold][ArbeidsforholdFormDataFields.perioderMedFravær];
    const annetDag: FraværDelerAvDag[] =
        values[SøknadFormField.annetArbeidsforhold][ArbeidsforholdFormDataFields.dagerMedDelvisFravær];

    const utbetalingsperioder: Utbetalingsperiode[] = mapPeriodeTilUtbetalingsperiode(
        [...arbeidsforholdPerioder, ...annetPeriode],
        [...arbeidsforholdDager, ...annetDag]
    );

    return (
        <SøknadStep
            id={StepID.ANNET}
            onValidFormSubmit={(): void => {
                onValidSubmit();
            }}
            // cleanupStep={cleanupStep}
            showSubmitButton={true}>
            <FormBlock paddingBottom={'l'}>
                <ContentWithHeader header={intlHelper(intl, 'step.annet.periodeoversikt.tittel')}>
                    <UtbetalingsperioderSummaryView utbetalingsperioder={utbetalingsperioder} />
                </ContentWithHeader>
            </FormBlock>

            <FormBlock margin={'l'}>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.perioderHarVærtIUtlandet}
                    legend={intlHelper(intl, 'step.periode.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {perioderHarVærtIUtlandet === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.perioderUtenlandsopphold}
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
            <FormBlock paddingBottom={'l'}>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.hjemmePgaSmittevernhensynYesOrNo}
                    legend={intlHelper(intl, 'steg.en.smittevern.sporsmal')}
                    validate={validateYesOrNoIsAnswered}
                    info={
                        <div className={'smittevern-info'}>
                            <FormattedHTMLMessage id={'steg.en.smittevern.info'} />
                        </div>
                    }
                />
            </FormBlock>
            {values[SøknadFormField.hjemmePgaSmittevernhensynYesOrNo] === YesOrNo.YES && (
                <>
                    <CounsellorPanel>
                        <Box padBottom={'l'}>
                            Du må laste opp en bekreftelse fra lege om at det er særlige smittevernhensyn som gjør at
                            barnet ikke kan gå i barnehage eller skole.
                        </Box>
                        <Box padBottom={'l'}>
                            Hvis du ikke har bekreftelsen tilgjengelig nå, må du ettersende den til oss så snart du har
                            den. Vi kan ikke behandle søknaden før vi har mottatt bekreftelsen.
                        </Box>
                    </CounsellorPanel>
                    <EkspanderbarPSG />
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'steg.dokumenter.smittevernVedlegg')}
                        formikName={SøknadFormField.smittevernDokumenter}
                        dokumenter={values[SøknadFormField.smittevernDokumenter]}
                    />
                </>
            )}
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.harSøktAndreUtbetalinger}
                    legend={intlHelper(intl, 'step.periode.har_søkt_andre_utbetalinger.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
                {values[SøknadFormField.harSøktAndreUtbetalinger] === YesOrNo.YES && (
                    <FormBlock>
                        <SøknadFormComponents.CheckboxPanelGroup
                            name={SøknadFormField.andreUtbetalinger}
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
    );
};

export default AnnetStepView;
