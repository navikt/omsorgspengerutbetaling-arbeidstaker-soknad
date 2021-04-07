import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DateRange, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import {
    FraværDag,
    fraværDagToFraværDateRange,
    FraværPeriode,
    fraværPeriodeToDateRange,
} from '@navikt/sif-common-forms/lib/fravær';
import FraværDagerListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværDagerListAndDialog';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';
import { validateAll, validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import dayjs from 'dayjs';
import MinMax from 'dayjs/plugin/minMax';
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
import { validateFraværDagHarÅrstall, validateFraværPeriodeHarÅrstall } from '../../validation/fieldValidations';

dayjs.extend(MinMax);

export const minimumHarPeriodeEllerDelerAvDagYes = (
    harPerioder: YesOrNo,
    harDelerAvDag: YesOrNo
): FieldValidationResult => {
    if (harPerioder === YesOrNo.NO && harDelerAvDag === YesOrNo.NO) {
        return { key: 'fieldvalidation.periode.ingen' };
    }
    return undefined;
};

const getÅrstallFromFravær = (
    dagerMedDelvisFravær: FraværDag[],
    perioderMedFravær: FraværPeriode[]
): number | undefined => {
    const førsteDag = dagerMedDelvisFravær.length > 0 ? dagerMedDelvisFravær[0].dato : undefined;
    const førsteDagIPeriode = perioderMedFravær.length > 0 ? perioderMedFravær[0].fraOgMed : undefined;
    const dager: Date[] = [...(førsteDag ? [førsteDag] : []), ...(førsteDagIPeriode ? [førsteDagIPeriode] : [])];
    switch (dager.length) {
        case 0:
            return undefined;
        case 1:
            return dayjs(dager[0]).get('year');
        default:
            return dayjs.min(dager.map((d) => dayjs(d))).get('year');
    }
};
const getTidsromFromÅrstall = (årstall?: number): DateRange => {
    if (årstall === undefined) {
        return { from: date1YearAgo, to: dayjs().endOf('day').toDate() };
    }
    const førsteDagIÅret = dayjs(`${årstall}-01-01`).toDate();
    const sisteDagIÅret = dayjs(`${årstall}-12-31`).toDate();
    return {
        from: førsteDagIÅret,
        to: dayjs.min([dayjs(sisteDagIÅret), dayjs(dateToday)]).toDate(),
    };
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

    const { fraværDager, fraværPerioder } = arbeidsforholdFormData;

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
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={validateAll([
                                validateRequiredList,
                                validateFraværPeriodeHarÅrstall(fraværPerioder, årstall),
                                validateNoCollisions(fraværDager, fraværPerioder),
                            ])}
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
                            minDate={minDateForFravær}
                            maxDate={maxDateForFravær}
                            validate={validateAll([
                                validateRequiredList,
                                validateFraværDagHarÅrstall(fraværDager, årstall),
                                validateNoCollisions(fraværDager, fraværPerioder),
                            ])}
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
