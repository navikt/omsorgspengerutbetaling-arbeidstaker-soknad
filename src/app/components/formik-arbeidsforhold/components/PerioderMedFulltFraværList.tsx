import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { validatePerioderMedFravær } from '../../../validation/fieldValidations';
import PerioderMedFulltFraværListItem from './PerioderMedFulltFraværListItem';
import { FormikInputGroup } from '@navikt/sif-common-formik/lib';
import { FraværDelerAvDag, Periode } from '../../../types/PeriodeTypes';
import { FieldValidationResult } from 'common/validation/types';

interface Props {
    perioderMedFravær: Periode[];
    dagerMedGradvisFravær: FraværDelerAvDag[];
    name: string;
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const PeriodeMedFulltFraværList: React.FunctionComponent<Props> = ({
    perioderMedFravær,
    dagerMedGradvisFravær,
    onCreateNew,
    onRemove,
    name,
}) => {
    return (
        <>
            <FormikInputGroup
                className="periodelistGroup"
                name={name}
                validate={(): FieldValidationResult =>
                    validatePerioderMedFravær(perioderMedFravær, dagerMedGradvisFravær)
                }>
                {perioderMedFravær.map((periode, index) => (
                    <PerioderMedFulltFraværListItem
                        name={name}
                        key={index}
                        index={index}
                        periode={periode}
                        onRemove={onRemove}
                        disabledPerioder={perioderMedFravær.filter((p) => p !== periode)}
                    />
                ))}
            </FormikInputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny periode med fullt fravær
                </Knapp>
            </FormBlock>
        </>
    );
};

export default PeriodeMedFulltFraværList;
