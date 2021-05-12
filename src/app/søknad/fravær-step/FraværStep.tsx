/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { isString, useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikAnnetArbeidsforholdStegTo from '../../components/formik-arbeidsforhold/FormikAnnetArbeidsforholdStegTo';
import FormikArbeidsforholdDelToArbeidslengde from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelToArbeidslengde';
import FormikArbeidsforholdDelTrePeriodeView from '../../components/formik-arbeidsforhold/FormikArbeidsforholdDelTrePeriode';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getAlleFraværDager, getAlleFraværPerioder } from '../../utils/arbeidsforholdUtils';
import { getTidsromFromÅrstall, getÅrstallFromFravær } from '../../utils/fraværUtils';
import { skalInkludereArbeidsforhold } from '../../validation/components/arbeidsforholdValidations';
import SøknadStep from '../SøknadStep';
import './fraværStep.less';

const cleanPerioderForArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
    return {
        ...arbeidsforhold,
        fraværPerioder:
            arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværPerioder],
        fraværDager:
            arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO
                ? []
                : arbeidsforhold[ArbeidsforholdFormDataFields.fraværDager],
    };
};

const cleanupStep = (søknadFormData: SøknadFormData): SøknadFormData => {
    const listeAvArbeidsforhold = søknadFormData[SøknadFormField.arbeidsforhold];
    const annetArbeidsforhold = søknadFormData[SøknadFormField.annetArbeidsforhold];

    return {
        ...søknadFormData,
        arbeidsforhold: listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData) =>
            cleanPerioderForArbeidsforhold(arbeidsforhold)
        ),
        annetArbeidsforhold: cleanPerioderForArbeidsforhold(annetArbeidsforhold),
    };
};

const FraværStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();

    const annetArbeidsforhold: ArbeidsforholdFormData = values[SøknadFormField.annetArbeidsforhold];
    const annetArbeidsforholdName: string | null = annetArbeidsforhold[ArbeidsforholdFormDataFields.navn];

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

    const arbeidsforholdElementListe = values[SøknadFormField.arbeidsforhold].map(
        (arbeidsforhold: ArbeidsforholdFormData, index) => {
            return skalInkludereArbeidsforhold(arbeidsforhold) ? (
                <FormBlock key={arbeidsforhold.organisasjonsnummer}>
                    <FormSection
                        titleTag="h2"
                        title={arbeidsforhold.navn || arbeidsforhold.organisasjonsnummer}
                        titleIcon={<BuildingIcon />}>
                        <FormikArbeidsforholdDelToArbeidslengde arbeidsforholdFormData={arbeidsforhold} index={index} />
                        <FormikArbeidsforholdDelTrePeriodeView
                            arbeidsforholdFormData={arbeidsforhold}
                            index={index}
                            minDateForFravær={minDateForFravær}
                            maxDateForFravær={maxDateForFravær}
                            årstall={årstall}
                        />
                    </FormSection>
                </FormBlock>
            ) : null;
        }
    );

    return (
        <SøknadStep
            id={StepID.FRAVÆR}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            cleanupStep={cleanupStep}
            showSubmitButton={true}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id={'steg2.arbeidslengdeOgPerioder.infopanel.del1'} />
                    </Box>
                    <Box>
                        <FormattedMessage
                            id={'steg2.arbeidslengdeOgPerioder.infopanel.del2'}
                            values={{ strong: (msg: string): React.ReactNode => <strong>{msg}</strong> }}
                        />
                    </Box>
                </CounsellorPanel>
            </FormBlock>
            {arbeidsforholdElementListe.length > 0 && (
                <FormBlock paddingBottom="l">
                    <div className="arbeidsforhold-liste">{arbeidsforholdElementListe}</div>
                </FormBlock>
            )}
            {skalInkludereArbeidsforhold(annetArbeidsforhold) && isString(annetArbeidsforholdName) && (
                <FormikAnnetArbeidsforholdStegTo
                    annetArbeidsforhold={annetArbeidsforhold}
                    annetArbeidsforholdName={annetArbeidsforholdName}
                    minDateForFravær={minDateForFravær}
                    maxDateForFravær={maxDateForFravær}
                    årstall={årstall}
                />
            )}
        </SøknadStep>
    );
};

export default FraværStep;
