import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from '../../lenker';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { StepID } from '../soknadStepsConfig';
import SoknadFormComponents from '../SoknadFormComponents';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateUtenlandsoppholdNeste12Mnd, validateUtenlandsoppholdSiste12Mnd } from './medlemsskapFieldValidation';
import dayjs from 'dayjs';
import SoknadFormStep from '../SoknadFormStep';

const MedlemsskapStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    return (
        <SoknadFormStep id={StepID.MEDLEMSKAP}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                <FormattedMessage id="step.medlemsskap.info" />
                <Lenke href={getLenker().medlemskap} target="_blank">
                    <FormattedMessage id="step.medlemsskap.info.lenkeTekst" />
                </Lenke>
                .
            </CounsellorPanel>
            <FormBlock margin="xxl">
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'step.medlemsskap.annetLandSiste12.spm')}
                    name={SøknadFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'step.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'step.medlemsskap.annetLandSiste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        name={SøknadFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dayjs(dateToday).subtract(1, 'day').toDate()}
                        validate={validateUtenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.medlemsskap.annetLandSiste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'step.medlemsskap.annetLandNeste12.spm')}
                    name={SøknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'step.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'step.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="m">
                    <BostedUtlandListAndDialog<SøknadFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={SøknadFormField.utenlandsoppholdNeste12Mnd}
                        validate={validateUtenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.medlemsskap.annetLandNeste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default MedlemsskapStep;
