import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { GYLDIG_TIDSROM } from '../../../validation/constants';
import {
    validateAll,
    validateDateInRange,
    validateDateNotInFuture,
    validateTomAfterFom
} from '../../../validation/fieldValidations';
import { FormikDateIntervalPicker } from '@navikt/sif-common-formik/lib';
import { Periode } from '../../../types/PeriodeTypes';

interface Props {
    index: number;
    name: string;
    periode?: Periode;
    disabledPerioder?: Periode[];
    onRemove?: (index: number) => void;
}

const bem = bemUtils('perioderMedFulltFravarListItem');

const PerioderMedFulltFraværListItem: React.FunctionComponent<Props> = ({
    index,
    periode,
    disabledPerioder,
    onRemove,
    name
}) => {
    const tomDateRange: Partial<DateRange> = {
        from: periode?.fom ? periode.fom : GYLDIG_TIDSROM.from,
        to: GYLDIG_TIDSROM.to
    };

    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('rangeWrapper')}>
                <FormikDateIntervalPicker
                    fromDatepickerProps={{
                        label: 'Fra og med',
                        validate: validateAll([validateRequiredField, validateDateInRange(GYLDIG_TIDSROM)]),
                        name: `${name}.${index}.fom`,
                        dateLimitations: {
                            minDato: GYLDIG_TIDSROM.from,
                            maksDato: dateToday,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                    toDatepickerProps={{
                        validate: validateAll([
                            validateRequiredField,
                            ...(periode?.fom ? [validateTomAfterFom(periode.fom)] : []),
                            validateDateInRange(tomDateRange),
                            validateDateNotInFuture()
                        ]),
                        label: 'Til og med',
                        name: `${name}.${index}.tom`,
                        dateLimitations: {
                            minDato: tomDateRange.from,
                            maksDato: dateToday,
                            ugyldigeTidsperioder: disabledPerioder || []
                        }
                    }}
                />
            </div>
            {onRemove && (
                <div className={bem.element('deleteButtonWrapper')}>
                    <Knapp mini={true} htmlType="button" onClick={() => onRemove(index)} form="kompakt">
                        Fjern
                    </Knapp>
                </div>
            )}
        </div>
    );
};

export default PerioderMedFulltFraværListItem;
