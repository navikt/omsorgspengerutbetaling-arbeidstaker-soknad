import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import ArbeidsforholdFravær from '../../components/formik-arbeidsforhold/ArbeidsforholdFravær';
import { cleanupStep } from './fraværStepUtils';
import { date1YearAgo, DateRange, dateToday } from 'common/utils/dateUtils';
import { useCallback, useEffect, useState } from 'react';
import { getAlleFraværDager, getAlleFraværPerioder } from '../../utils/arbeidsforholdUtils';
import { getTidsromFromÅrstall, getÅrstallFromFravær } from '../../utils/fraværUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { getYesOrNoValidator, getListValidator } from '@navikt/sif-common-formik/lib/validation';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SoknadFormComponents from '../SoknadFormComponents';
import './periodeStep.less';

const FraværStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const { perioderHarVærtIUtlandet } = values;
    const arbeidsforholdliste = values[SøknadFormField.arbeidsforhold].filter((arbeidsforhold) =>
        skalInkludereArbeidsforhold(arbeidsforhold)
    );

    const fraværDager = getAlleFraværDager(values);
    const fraværPerioder = getAlleFraværPerioder(values);

    const [årstall, setÅrstall] = useState<number | undefined>();
    const [gyldigTidsrom, setGyldigTidsrom] = useState<DateRange>(
        getTidsromFromÅrstall(getÅrstallFromFravær(fraværDager, fraværPerioder))
    );

    const updateÅrstall = useCallback(
        (årstall: number | undefined) => {
            setÅrstall(årstall);
            setGyldigTidsrom(getTidsromFromÅrstall(årstall));
        },
        [setÅrstall]
    );

    useEffect(() => {
        const nyttÅrstall = getÅrstallFromFravær(fraværDager, fraværPerioder);
        if (nyttÅrstall !== årstall) {
            updateÅrstall(nyttÅrstall);
        }
    }, [årstall, fraværDager, fraværPerioder, updateÅrstall]);

    const harRegistrertFravær = fraværDager.length + fraværPerioder.length > 0;
    const minDateForFravær = harRegistrertFravær ? gyldigTidsrom.from : date1YearAgo;
    const maxDateForFravær = harRegistrertFravær ? gyldigTidsrom.to : dateToday;

    return (
        <SoknadFormStep id={StepID.FRAVÆR} onStepCleanup={cleanupStep}>
            <FormBlock>
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <FormattedMessage id={'step.fravær.info.1'} />
                    <Box margin={'m'}>
                        <FormattedMessage
                            id={'step.fravær.info.2'}
                            values={{ strong: (msg: string): React.ReactNode => <strong>{msg}</strong> }}
                        />
                    </Box>
                </CounsellorPanel>
            </FormBlock>
            {arbeidsforholdliste && arbeidsforholdliste.length > 0 && (
                <FormBlock paddingBottom="l">
                    {values[SøknadFormField.arbeidsforhold].map((arbeidsforhold: ArbeidsforholdFormData, index) => {
                        if (skalInkludereArbeidsforhold(arbeidsforhold)) {
                            return (
                                <FormBlock margin="xxl" key={arbeidsforhold.organisasjonsnummer}>
                                    <FormSection
                                        key={arbeidsforhold.organisasjonsnummer}
                                        titleTag="h2"
                                        title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer}
                                        titleIcon={<BuildingIcon />}>
                                        <ArbeidsforholdFravær
                                            arbeidsforhold={arbeidsforhold}
                                            parentFieldName={`${SøknadFormField.arbeidsforhold}.${index}`}
                                            minDateForFravær={minDateForFravær}
                                            maxDateForFravær={maxDateForFravær}
                                            årstall={årstall}
                                        />
                                    </FormSection>
                                </FormBlock>
                            );
                        }
                        return null;
                    })}
                </FormBlock>
            )}
            <FormBlock margin={'xxl'}>
                <FormSection title={intlHelper(intl, 'step.fravær.utenlandsopphold.tittel')}>
                    <FormBlock margin={'l'}>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.perioderHarVærtIUtlandet}
                            legend={intlHelper(intl, 'step.fravær.værtIUtlandet.spm')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {perioderHarVærtIUtlandet === YesOrNo.YES && (
                        <FormBlock margin="l">
                            <BostedUtlandListAndDialog<SøknadFormField>
                                name={SøknadFormField.perioderUtenlandsopphold}
                                minDate={date1YearAgo}
                                maxDate={dateToday}
                                labels={{
                                    addLabel: intlHelper(intl, 'step.fravær.værtIUtlandet.leggTilLabel'),
                                    modalTitle: intlHelper(intl, 'step.fravær.værtIUtlandet.modalTittel'),
                                }}
                                validate={getListValidator({ required: true })}
                            />
                        </FormBlock>
                    )}
                </FormSection>
            </FormBlock>
        </SoknadFormStep>
    );
};

export default FraværStep;
