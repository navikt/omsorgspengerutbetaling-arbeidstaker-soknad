import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib/fravær';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredList, validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { Utbetalingsperiode } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { mapFraværTilUtbetalingsperiode } from '../../utils/formToApiMaps/mapPeriodeToApiData';
import UtbetalingsperioderSummaryView from '../oppsummering-step/components/UtbetalingsperioderSummaryView';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadStep from '../SøknadStep';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';

const AnnetStepView: React.FC<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderHarVærtIUtlandet } = values;
    const intl = useIntl();

    const arbeidsforholdPerioder: FraværPeriode[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværPerioder;
        })
        .flat();

    const arbeidsforholdDager: FraværDag[] = values.arbeidsforhold
        .map((arbeidsforhold: ArbeidsforholdFormData) => {
            return arbeidsforhold.fraværDager;
        })
        .flat();

    const utbetalingsperioder: Utbetalingsperiode[] = mapFraværTilUtbetalingsperiode(
        arbeidsforholdPerioder,
        arbeidsforholdDager
    );

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
                    legend={intlHelper(intl, 'step.annet.værtIUtlandet.spm')}
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
                            addLabel: intlHelper(intl, 'step.annet.værtIUtlandet.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.annet.værtIUtlandet.modalTittel'),
                        }}
                        validate={validateRequiredList}
                    />
                </FormBlock>
            )}
            <FormBlock paddingBottom={'l'}>
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.hjemmePgaSmittevernhensynYesOrNo}
                    legend={intlHelper(intl, 'step.annet.smittevern.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.annet.smittevern.info.tittel')}>
                            <FormattedHtmlMessage id="steg.annet.smittevern.info.html" />
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
                        uploadButtonLabel={intlHelper(intl, 'steg.annet.smittevern.vedlegg')}
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
        </SøknadStep>
    );
};

export default AnnetStepView;
