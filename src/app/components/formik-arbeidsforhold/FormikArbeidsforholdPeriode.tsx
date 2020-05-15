import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { FieldArray, useFormikContext } from 'formik';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';

export const minimumHarPeriodeEllerDelerAvDagYes = (
    harPerioder: YesOrNo,
    harDelerAvDag: YesOrNo
): string | undefined => {
    if (harPerioder === YesOrNo.NO && harDelerAvDag === YesOrNo.NO) {
        return 'Minimum én periode for arbeidsforholdet må spesifiseres.';
    }
    return undefined;
};

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
    const { validateField, validateForm } = useFormikContext<SøknadFormData>();

    const kanIkkeFortsette =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO;

    return (
        <>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={nameHarPerioderMedFravær}
                    legend={intlHelper(intl, 'periode.heledager.spm')}
                    validate={(value: YesOrNo) => {
                        if (value === YesOrNo.UNANSWERED) {
                            return 'må svare på spørsmålene';
                        }
                        return minimumHarPeriodeEllerDelerAvDagYes(
                            arbeidsforholdFormData.harPerioderMedFravær,
                            arbeidsforholdFormData.harDagerMedDelvisFravær
                        );
                    }}
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
                                            validateField(namePerioderMedFravær);
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
                    validate={(value: YesOrNo) => {
                        if (value === YesOrNo.UNANSWERED) {
                            return 'må svare på spørsmålene';
                        }
                        return minimumHarPeriodeEllerDelerAvDagYes(
                            arbeidsforholdFormData.harPerioderMedFravær,
                            arbeidsforholdFormData.harDagerMedDelvisFravær
                        );
                    }}
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
                    <AlertStripeAdvarsel>
                        <FormattedHTMLMessage id={'validation.minimum_en_periode_per_arbeidsforhold_required'} />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </>
    );
};

export default FormikArbeidsforholdPeriodeView;
