import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { fraværDagToFraværDateRange, validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateAll } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    createFieldValidationError,
    FieldValidationErrors,
    validateRequiredList,
} from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { GYLDIG_TIDSROM } from '../../validation/constants';

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
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
}

const ArbeidsforholdPeriode: React.FC<Props> = ({ arbeidsforhold, parentFieldName }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;

    const kanIkkeFortsette =
        arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.NO &&
        arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.NO;

    return (
        <>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormDataFields.harPerioderMedFravær)}
                    legend={intlHelper(intl, 'step.periode.heledager.spm')}
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
                        }
                        return minimumHarPeriodeEllerDelerAvDagYes(
                            arbeidsforhold.harPerioderMedFravær,
                            arbeidsforhold.harDagerMedDelvisFravær
                        );
                    }}
                />
            </FormBlock>

            {/* DAGER MED FULLT FRAVÆR*/}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FraværPerioderListAndDialog
                            name={getFieldName(ArbeidsforholdFormDataFields.fraværPerioder)}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(arbeidsforhold.fraværDager, arbeidsforhold.fraværPerioder),
                            ])}
                            labels={{
                                addLabel: intlHelper(intl, 'step.periode.heledager.perioderModal.label'),
                                modalTitle: intlHelper(intl, 'step.periode.heledager.perioderModal.title'),
                            }}
                            dateRangesToDisable={[
                                ...arbeidsforhold.fraværPerioder,
                                ...arbeidsforhold.fraværDager.map(fraværDagToFraværDateRange),
                            ]}
                            helgedagerIkkeTillat={true}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title={intlHelper(intl, 'step.periode.forklaringHelg.title')}>
                                <FormattedMessage id={'step.periode.forklaringHelg'} />
                            </ExpandableInfo>
                        </FormBlock>
                    </FormBlock>
                </>
            )}
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormDataFields.harDagerMedDelvisFravær)}
                    legend={intlHelper(intl, 'step.periode.delvisdag.spm')}
                    validate={(value: YesOrNo): FieldValidationResult => {
                        if (value === YesOrNo.UNANSWERED) {
                            return createFieldValidationError(FieldValidationErrors.påkrevd);
                        }
                        return minimumHarPeriodeEllerDelerAvDagYes(
                            arbeidsforhold.harPerioderMedFravær,
                            arbeidsforhold.harDagerMedDelvisFravær
                        );
                    }}
                />
            </FormBlock>

            {/* DAGER MED DELVIS FRAVÆR*/}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FraværDagerListAndDialog
                            name={getFieldName(ArbeidsforholdFormDataFields.fraværDager)}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(arbeidsforhold.fraværDager, arbeidsforhold.fraværPerioder),
                            ])}
                            labels={{
                                addLabel: intlHelper(intl, 'step.periode.delvisdag.dagModal.label'),
                                modalTitle: intlHelper(intl, 'step.periode.delvisdag.dagModal.title'),
                            }}
                            dateRangesToDisable={[
                                ...arbeidsforhold.fraværDager.map(fraværDagToFraværDateRange),
                                ...arbeidsforhold.fraværPerioder,
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title={intlHelper(intl, 'step.periode.forklaringHelg.title')}>
                                <FormattedMessage id={'step.periode.forklaringHelg'} />
                            </ExpandableInfo>
                        </FormBlock>
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

export default ArbeidsforholdPeriode;
