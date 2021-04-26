import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import {
    getListValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { fraværDagToFraværDateRange, fraværPeriodeToDateRange } from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { validateFraværDagHarÅrstall, validateFraværPeriodeHarÅrstall } from '../../validation/fieldValidations';

export const minimumHarPeriodeEllerDelerAvDagYes = (
    harPerioder: YesOrNo,
    harDelerAvDag: YesOrNo
): ValidationResult<ValidationError> => {
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
    minDateForFravær: Date;
    maxDateForFravær: Date;
    årstall?: number;
}

const FormikArbeidsforholdPeriodeView: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameHarPerioderMedFravær,
    namePerioderMedFravær,
    nameHarDagerMedDelvisFravær,
    nameDagerMedDelvisFravær,
    maxDateForFravær,
    minDateForFravær,
    årstall,
}: Props) => {
    const intl = useIntl();

    const kanIkkeFortsette =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO;

    const { fraværDager, fraværPerioder } = arbeidsforholdFormData;

    const tidsromBegrensningInfo = (
        <ExpandableInfo title={intlHelper(intl, 'step.fravaer.info.ikkeHelg.tittel')}>
            <FormattedMessage id="step.fravaer.info.ikkeHelg.tekst" />
        </ExpandableInfo>
    );
    return (
        <>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={nameHarPerioderMedFravær}
                    legend={intlHelper(intl, 'periode.heledager.spm')}
                    validate={(value) =>
                        validateAll([
                            () => getYesOrNoValidator()(value),
                            () =>
                                minimumHarPeriodeEllerDelerAvDagYes(
                                    arbeidsforholdFormData.harPerioderMedFravær,
                                    arbeidsforholdFormData.harDagerMedDelvisFravær
                                ),
                        ])
                    }
                />
            </FormBlock>
            {/* DAGER MED FULLT FRAVÆR*/}
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.YES && (
                <>
                    <FormBlock paddingBottom={'l'} margin={'l'}>
                        <FraværPerioderListAndDialog
                            name={namePerioderMedFravær}
                            periodeDescription={tidsromBegrensningInfo}
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={(value) =>
                                validateAll([
                                    () => getListValidator({ required: true })(value),
                                    () => validateFraværPeriodeHarÅrstall(fraværPerioder, årstall),
                                    () => validateNoCollisions(fraværDager, fraværPerioder),
                                ])
                            }
                            labels={{
                                addLabel: 'Legg til ny periode med fullt fravær',
                                modalTitle: 'Fravær hele dager',
                            }}
                            dateRangesToDisable={[
                                ...fraværPerioder.map(fraværPeriodeToDateRange),
                                ...fraværDager.map(fraværDagToFraværDateRange),
                            ]}
                            helgedagerIkkeTillat={true}
                        />
                    </FormBlock>
                </>
            )}
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={nameHarDagerMedDelvisFravær}
                    legend={intlHelper(intl, 'periode.delvisdag.spm')}
                    validate={(value) =>
                        validateAll([
                            () => {
                                return getYesOrNoValidator()(value);
                            },
                            () =>
                                minimumHarPeriodeEllerDelerAvDagYes(
                                    arbeidsforholdFormData.harPerioderMedFravær,
                                    arbeidsforholdFormData.harDagerMedDelvisFravær
                                ),
                        ])
                    }
                />
            </FormBlock>
            {/* DAGER MED DELVIS FRAVÆR*/}
            {arbeidsforholdFormData[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.YES && (
                <>
                    <FormBlock margin={'l'} paddingBottom={'l'}>
                        <FraværDagerListAndDialog
                            name={nameDagerMedDelvisFravær}
                            dagDescription={tidsromBegrensningInfo}
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={(value) =>
                                validateAll([
                                    () => getRequiredFieldValidator()(value),
                                    () => validateFraværDagHarÅrstall(fraværDager, årstall),
                                    () => validateNoCollisions(fraværDager, fraværPerioder),
                                ])
                            }
                            labels={{
                                addLabel: 'Legg til ny dag med delvis fravær',
                                modalTitle: 'Fravær deler av dag',
                            }}
                            dateRangesToDisable={[
                                ...arbeidsforholdFormData.fraværDager.map(fraværDagToFraværDateRange),
                                ...fraværPerioder.map(fraværPeriodeToDateRange),
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                    </FormBlock>
                </>
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
