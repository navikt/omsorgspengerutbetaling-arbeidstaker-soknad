import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import {
    SøknadFormData
} from '../../types/SøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import { FieldArray, useFormikContext } from 'formik';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { useIntl } from 'react-intl';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    nameHarPerioderMedFravær: string;
    namePerioderMedFravær: string;
    nameHarDagerMedDelvisFravær: string;
    nameDagerMedDelvisFravær: string;
}

const FormikArbeidsforholdPeriodeView: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameHarPerioderMedFravær,
    namePerioderMedFravær,
    nameHarDagerMedDelvisFravær,
    nameDagerMedDelvisFravær
}) => {
    const intl = useIntl();
    // TODO: validateField og validateForm funker? (sikkert ikke)
    const { validateField, validateForm } = useFormikContext<SøknadFormData>();

    const kanIkkeFortsette =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO;

    return (
        <>
            <FormBlock>
                <FormikYesOrNoQuestion
                    // name={SøknadFormField.harPerioderMedFravær}
                    name={nameHarPerioderMedFravær}
                    legend={intlHelper(intl, 'periode.heledager.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED FULLT FRAVÆR*/}
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.YES && (
                <FormBlock
                    margin={
                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær].length > 0
                            ? 'l'
                            : 'none'
                    }>
                    <FieldArray
                        name={namePerioderMedFravær}
                        render={(arrayHelpers) => {
                            return (
                                <PeriodeMedFulltFraværList
                                    name={namePerioderMedFravær}
                                    perioderMedFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.perioderMedFravær]
                                    }
                                    dagerMedGradvisFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                    }
                                    onCreateNew={() => {
                                        const emptyPeriodeMedFravær: Partial<Periode> = {
                                            fom: undefined,
                                            tom: undefined
                                        };

                                        arrayHelpers.insert(
                                            arbeidsforholdFormData[ArbeidsforholdFormDataFields.perioderMedFravær]
                                                .length,
                                            emptyPeriodeMedFravær
                                        );
                                        setTimeout(() => {
                                            validateField(
                                                namePerioderMedFravær
                                            );
                                        });
                                    }}
                                    onRemove={(idx) => {
                                        arrayHelpers.remove(idx);
                                        setTimeout(() => {
                                            validateForm();
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={nameHarDagerMedDelvisFravær}
                    legend={intlHelper(intl, 'periode.delvisdag.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {/* DAGER MED DELVIS FRAVÆR*/}
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.YES && (
                <FormBlock
                    margin={
                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær].length > 0
                            ? 'l'
                            : 'none'
                    }>
                    <FieldArray
                        name={nameDagerMedDelvisFravær}
                        render={(arrayHelpers) => {
                            return (
                                <DagerMedDelvisFraværList
                                    name={nameDagerMedDelvisFravær}
                                    dagerMedDelvisFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                    }
                                    perioderMedFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.perioderMedFravær]
                                    }
                                    onCreateNew={() => {
                                        const emptyDagMedFravær: Partial<FraværDelerAvDag> = {
                                            dato: undefined,
                                            timer: undefined
                                        };
                                        arrayHelpers.insert(
                                            arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                                .length,
                                            emptyDagMedFravær
                                        );
                                    }}
                                    onRemove={(idx) => {
                                        arrayHelpers.remove(idx);
                                        setTimeout(() => {
                                            validateForm();
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </FormBlock>
            )}

            {kanIkkeFortsette && (
                <FormBlock margin="xxl">
                    <AlertStripeAdvarsel>Du må velge én av situasjonene over. </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </>
    );
};

export default FormikArbeidsforholdPeriodeView;