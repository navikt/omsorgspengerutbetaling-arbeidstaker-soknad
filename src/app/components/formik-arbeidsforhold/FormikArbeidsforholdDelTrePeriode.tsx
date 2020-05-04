import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    SøknadFormData,
    SøknadFormField
} from '../../types/SøknadFormData';
import FormBlock from 'common/components/form-block/FormBlock';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import PeriodeMedFulltFraværList from './components/PerioderMedFulltFraværList';
import { FraværDelerAvDag, Periode } from '../../../@types/omsorgspengerutbetaling-schema';
import DagerMedDelvisFraværList from './components/DagerMedDelvisFraværList';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelTrePeriodeView: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    // TODO: validateField og validateForm funker? (sikkert ikke)
    const { validateField, validateForm } = useFormikContext<SøknadFormData>();

    const kanIkkeFortsette =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO;

    // TODO: FORTSETT HER. Periodetinga er lagt til på hvert ArbeidsforholdFormData. Så nå skal bare tinga under rettes....

    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getArbeidsforholdFormDataFieldName = (field: ArbeidsforholdFormDataFields) =>
                    `${name}.${index}.${field}`;

                return (
                    <>
                        <FormBlock>
                            <FormikYesOrNoQuestion
                                // name={SøknadFormField.harPerioderMedFravær}
                                name={getArbeidsforholdFormDataFieldName(
                                    ArbeidsforholdFormDataFields.harPerioderMedFravær
                                )}
                                legend="Søker du om utbetaling for hele dager med fravær fra jobb?"
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
                                    name={getArbeidsforholdFormDataFieldName(
                                        ArbeidsforholdFormDataFields.perioderMedFravær
                                    )}
                                    render={(arrayHelpers) => {
                                        return (
                                            <PeriodeMedFulltFraværList
                                                name={getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.perioderMedFravær)}
                                                perioderMedFravær={
                                                    arbeidsforholdFormData[
                                                        ArbeidsforholdFormDataFields.perioderMedFravær
                                                    ]
                                                }
                                                dagerMedGradvisFravær={
                                                    arbeidsforholdFormData[
                                                        ArbeidsforholdFormDataFields.dagerMedDelvisFravær
                                                    ]
                                                }
                                                onCreateNew={() => {
                                                    const emptyPeriodeMedFravær: Partial<Periode> = {
                                                        fom: undefined,
                                                        tom: undefined
                                                    };

                                                    arrayHelpers.insert(
                                                        arbeidsforholdFormData[
                                                            ArbeidsforholdFormDataFields.perioderMedFravær
                                                        ].length,
                                                        emptyPeriodeMedFravær
                                                    );
                                                    setTimeout(() => {
                                                        validateField(
                                                            getArbeidsforholdFormDataFieldName(
                                                                ArbeidsforholdFormDataFields.perioderMedFravær
                                                            )
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
                                name={getArbeidsforholdFormDataFieldName(
                                    ArbeidsforholdFormDataFields.harDagerMedDelvisFravær
                                )}
                                legend="Søker du om utbetaling for dager med delvis fravær fra jobb?"
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        {/* DAGER MED DELVIS FRAVÆR*/}
                        {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] ===
                            YesOrNo.YES && (
                            <FormBlock
                                margin={
                                    arbeidsforholdFormData[ArbeidsforholdFormDataFields.dagerMedDelvisFravær].length > 0
                                        ? 'l'
                                        : 'none'
                                }>
                                <FieldArray
                                    name={getArbeidsforholdFormDataFieldName(
                                        ArbeidsforholdFormDataFields.dagerMedDelvisFravær
                                    )}
                                    render={(arrayHelpers) => {
                                        return (
                                            <DagerMedDelvisFraværList
                                                name={getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.dagerMedDelvisFravær)}
                                                dagerMedDelvisFravær={
                                                    arbeidsforholdFormData[
                                                        ArbeidsforholdFormDataFields.dagerMedDelvisFravær
                                                    ]
                                                }
                                                perioderMedFravær={
                                                    arbeidsforholdFormData[
                                                        ArbeidsforholdFormDataFields.perioderMedFravær
                                                    ]
                                                }
                                                onCreateNew={() => {
                                                    const emptyDagMedFravær: Partial<FraværDelerAvDag> = {
                                                        dato: undefined,
                                                        timer: undefined
                                                    };
                                                    arrayHelpers.insert(
                                                        arbeidsforholdFormData[
                                                            ArbeidsforholdFormDataFields.dagerMedDelvisFravær
                                                        ].length,
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
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelTrePeriodeView;
