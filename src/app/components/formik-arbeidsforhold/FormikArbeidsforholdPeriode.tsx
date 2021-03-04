import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import {
    fraværDagToFraværDateRange,
    fraværPeriodeToDateRange,
    validateNoCollisions,
} from '@navikt/sif-common-forms/lib/fravær';
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
    nameDagerMedDelvisFravær,
}: Props) => {
    const intl = useIntl();

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
                <>
                    <FormBlock paddingBottom={'l'} margin={'l'}>
                        <FraværPerioderListAndDialog
                            name={namePerioderMedFravær}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(
                                    arbeidsforholdFormData.fraværDager,
                                    arbeidsforholdFormData.fraværPerioder
                                ),
                            ])}
                            labels={{
                                addLabel: 'Legg til ny periode med fullt fravær',
                                modalTitle: 'Fravær hele dager',
                            }}
                            dateRangesToDisable={[
                                ...arbeidsforholdFormData.fraværPerioder.map(fraværPeriodeToDateRange),
                                ...arbeidsforholdFormData.fraværDager.map(fraværDagToFraværDateRange),
                            ]}
                            helgedagerIkkeTillat={true}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title="Hvorfor kan jeg ikke velge lørdag eller søndag?">
                                Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller
                                søndag. Derfor kan du ikke velge lørdag eller søndag som start- eller sluttdato i
                                perioden du legger inn.
                            </ExpandableInfo>
                        </FormBlock>
                    </FormBlock>
                </>
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
                <>
                    <FormBlock margin={'l'} paddingBottom={'l'}>
                        <FraværDagerListAndDialog
                            name={nameDagerMedDelvisFravær}
                            minDate={GYLDIG_TIDSROM.from || date1YearAgo}
                            maxDate={GYLDIG_TIDSROM.to || dateToday}
                            validate={validateAll([
                                validateRequiredList,
                                validateNoCollisions(
                                    arbeidsforholdFormData.fraværDager,
                                    arbeidsforholdFormData.fraværPerioder
                                ),
                            ])}
                            labels={{
                                addLabel: 'Legg til ny dag med delvis fravær',
                                modalTitle: 'Fravær deler av dag',
                            }}
                            dateRangesToDisable={[
                                ...arbeidsforholdFormData.fraværDager.map(fraværDagToFraværDateRange),
                                ...arbeidsforholdFormData.fraværPerioder.map(fraværPeriodeToDateRange),
                            ]}
                            helgedagerIkkeTillatt={true}
                            maksArbeidstidPerDag={24}
                        />
                        <FormBlock margin={'l'}>
                            <ExpandableInfo title="Hvorfor kan jeg ikke velge lørdag eller søndag?">
                                Du kan kun få utbetalt omsorgspenger for hverdager, selv om du jobber lørdag eller
                                søndag. Derfor kan du ikke legge inn delvis fravær på lørdager eller søndager.
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

export default FormikArbeidsforholdPeriodeView;
