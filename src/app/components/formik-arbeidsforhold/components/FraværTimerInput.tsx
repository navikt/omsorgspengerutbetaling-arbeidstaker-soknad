import React from 'react';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG, MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG } from '../../../validation/constants';
import { validateAll, validateHours } from '../../../validation/fieldValidations';
import { FormikInput } from '@navikt/sif-common-formik/lib';

interface Props {
    name: string;
    index: number;
}

const FraværTimerInput: React.FunctionComponent<Props> = ({ name, index }) => (
    <FormikInput
        inputMode="decimal"
        label={'Timer'}
        name={`${name}.${index}.timer`}
        bredde="XS"
        min={MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG}
        max={MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG}
        validate={validateAll([
            validateRequiredField,
            validateHours({
                min: MIN_ANTALL_TIMER_MED_FRAVÆR_EN_DAG,
                max: MAKS_ANTALL_TIMER_MED_FRAVÆR_EN_DAG
            })
        ])}
    />
);

export default FraværTimerInput;
