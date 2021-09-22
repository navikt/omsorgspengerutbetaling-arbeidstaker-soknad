import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { fraværDagToFraværDateRange, fraværPeriodeToDateRange } from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import {
    AppFieldValidationErrors,
    getFraværDagerValidator,
    getFraværPerioderValidator,
} from '../../validation/fieldValidations';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { getYesOrNoValidator, ValidateYesOrNoError } from '@navikt/sif-common-formik/lib/validation';

export const minimumHarPeriodeEllerDelerAvDagYes = (
    harPerioder: YesOrNo,
    harDelerAvDag: YesOrNo
): ValidationResult<ValidationError> => {
    if (harPerioder === YesOrNo.NO && harDelerAvDag === YesOrNo.NO) {
        return { key: AppFieldValidationErrors.periode_ingenDagerEllerPerioder, keepKeyUnaltered: true };
    }
    return undefined;
};

interface Props {
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
    minDateForFravær: Date;
    maxDateForFravær: Date;
    årstall?: number;
}

const ArbeidsforholdFravær: React.FC<Props> = ({
    arbeidsforhold,
    parentFieldName,
    maxDateForFravær,
    minDateForFravær,
    årstall,
}: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;

    const { fraværDager, fraværPerioder } = arbeidsforhold;

    const tidsromBegrensningInfo = (
        <ExpandableInfo title={intlHelper(intl, 'step.fravær.info.ikkeHelg.tittel')}>
            <FormattedMessage id="step.fravær.info.ikkeHelg.tekst" />
        </ExpandableInfo>
    );

    return (
        <>
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormDataFields.harPerioderMedFravær)}
                    legend={intlHelper(intl, 'step.fravær.heledager.spm')}
                    validate={(value) => {
                        const error = validateAll([
                            () => getYesOrNoValidator()(value),
                            () =>
                                minimumHarPeriodeEllerDelerAvDagYes(
                                    arbeidsforhold.harPerioderMedFravær,
                                    arbeidsforhold.harDagerMedDelvisFravær
                                ),
                        ]);
                        if (error === ValidateYesOrNoError.yesOrNoIsUnanswered) {
                            return {
                                key: AppFieldValidationErrors.arbeidsforhold_harPerioderMedFravær_yesOrNoIsUnanswered,
                                keepKeyUnaltered: true,
                            };
                        }
                        return error;
                    }}
                />
            </FormBlock>

            {/* DAGER MED FULLT FRAVÆR*/}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harPerioderMedFravær] === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FraværPerioderListAndDialog
                            name={getFieldName(ArbeidsforholdFormDataFields.fraværPerioder)}
                            periodeDescription={tidsromBegrensningInfo}
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={getFraværPerioderValidator({ fraværDager, årstall })}
                            labels={{
                                addLabel: intlHelper(intl, 'step.fravær.heledager.perioderModal.label'),
                                modalTitle: intlHelper(intl, 'step.fravær.heledager.perioderModal.title'),
                            }}
                            dateRangesToDisable={[
                                ...fraværPerioder.map(fraværPeriodeToDateRange),
                                ...fraværDager.map(fraværDagToFraværDateRange),
                            ]}
                            begrensTilSammeÅrAlertStripeTekst={intlHelper(
                                intl,
                                'step.fravær.heledager.perioderModal.begrensTilSammeÅrAlertStripeTekst'
                            )}
                            helgedagerIkkeTillat={true}
                        />
                    </FormBlock>
                </>
            )}
            <FormBlock>
                <FormikYesOrNoQuestion
                    name={getFieldName(ArbeidsforholdFormDataFields.harDagerMedDelvisFravær)}
                    legend={intlHelper(intl, 'step.fravær.delvisdag.spm')}
                    validate={(value) => {
                        const error = validateAll([
                            () => {
                                return getYesOrNoValidator()(value);
                            },
                            () =>
                                minimumHarPeriodeEllerDelerAvDagYes(
                                    arbeidsforhold.harPerioderMedFravær,
                                    arbeidsforhold.harDagerMedDelvisFravær
                                ),
                        ]);
                        if (error === ValidateYesOrNoError.yesOrNoIsUnanswered) {
                            return {
                                key:
                                    AppFieldValidationErrors.arbeidsforhold_harDagerMedDelvisFravær_yesOrNoIsUnanswered,
                                keepKeyUnaltered: true,
                            };
                        }
                        return error;
                    }}
                />
            </FormBlock>

            {/* DAGER MED DELVIS FRAVÆR*/}
            {arbeidsforhold[ArbeidsforholdFormDataFields.harDagerMedDelvisFravær] === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FraværDagerListAndDialog
                            name={getFieldName(ArbeidsforholdFormDataFields.fraværDager)}
                            dagDescription={tidsromBegrensningInfo}
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={getFraværDagerValidator({ fraværPerioder, årstall })}
                            labels={{
                                addLabel: intlHelper(intl, 'step.fravær.delvisdag.dagModal.label'),
                                modalTitle: intlHelper(intl, 'step.fravær.delvisdag.dagModal.title'),
                            }}
                            dateRangesToDisable={[
                                ...fraværDager.map(fraværDagToFraværDateRange),
                                ...fraværPerioder.map(fraværPeriodeToDateRange),
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                    </FormBlock>
                </>
            )}
        </>
    );
};

export default ArbeidsforholdFravær;
