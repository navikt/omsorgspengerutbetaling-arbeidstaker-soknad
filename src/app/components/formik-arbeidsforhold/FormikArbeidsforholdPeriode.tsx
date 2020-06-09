import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { FieldArray, useFormikContext } from 'formik';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { FormattedMessage, useIntl } from 'react-intl';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { createFieldValidationError, FieldValidationErrors } from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';

export const minimumHarPeriodeEllerDelerAvDagYes = (
    harPerioder: YesOrNo,
    harDelerAvDag: YesOrNo
): FieldValidationResult => {
    if (harPerioder === YesOrNo.NO && harDelerAvDag === YesOrNo.NO) {
        return { key: 'fieldvalidation.periode.ingen' };
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
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
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
                <FormBlock margin={'m'}>
                    <AlertStripeInfo>
                        Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller søndag.
                        Derfor kan du ikke velge lørdag eller søndag som start- eller sluttdato i perioden du legger
                        inn.
                    </AlertStripeInfo>
                    <FieldArray
                        name={namePerioderMedFravær}
                        render={(arrayHelpers): JSX.Element => {
                            return (
                                <PeriodeMedFulltFraværList
                                    name={namePerioderMedFravær}
                                    perioderMedFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.perioderMedFravær]
                                    }
                                    dagerMedGradvisFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                    }
                                    onCreateNew={(): void => {
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
                                    onRemove={(idx): void => {
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
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
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
                <FormBlock margin={'m'}>
                    <AlertStripeInfo>
                        Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller søndag.
                        Derfor kan du ikke legge inn delvis fravær på lørdager eller søndager.
                    </AlertStripeInfo>
                    <FieldArray
                        name={nameDagerMedDelvisFravær}
                        render={(arrayHelpers): JSX.Element => {
                            return (
                                <DagerMedDelvisFraværList
                                    name={nameDagerMedDelvisFravær}
                                    dagerMedDelvisFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                    }
                                    perioderMedFravær={
                                        arbeidsforholdFormData[ArbeidsforholdFormDataFields.perioderMedFravær]
                                    }
                                    onCreateNew={(): void => {
                                        const emptyDagMedFravær: Partial<FraværDelerAvDag> = {
                                            dato: undefined,
                                            timer: undefined
                                        };
                                        arrayHelpers.insert(
                                            arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær]
                                                .length,
                                            emptyDagMedFravær
                                        );
                                        setTimeout(() => {
                                            validateField(nameDagerMedDelvisFravær);
                                        });
                                    }}
                                    onRemove={(idx): void => {
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
                        <FormattedMessage id={'validation.minimum_en_periode_per_arbeidsforhold_required'} />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </>
    );
};

export default FormikArbeidsforholdPeriodeView;
