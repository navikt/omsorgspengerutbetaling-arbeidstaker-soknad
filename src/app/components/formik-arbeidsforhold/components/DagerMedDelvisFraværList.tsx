import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Knapp } from 'nav-frontend-knapper';
import { FraværDelerAvDag, Periode } from '../../../../@types/omsorgspengerutbetaling-schema';
import { validateDagerMedFravær } from '../../../validation/fieldValidations';
import DagerMedDelvisFraværListItem from './DagerMedDelvisFraværListItem';
import { FormikInputGroup } from '@navikt/sif-common-formik/lib';

interface Props {
    name: string;
    dagerMedDelvisFravær: FraværDelerAvDag[];
    perioderMedFravær: Periode[];
    onRemove: (idx: number) => void;
    onCreateNew: () => void;
}

const DagerMedDelvisFraværList: React.FunctionComponent<Props> = ({
    name,
    dagerMedDelvisFravær,
    perioderMedFravær,
    onRemove,
    onCreateNew
}) => {
    return (
        <>
            <FormikInputGroup
                className={'periodelistGroup'}
                name={name}
                validate={() => validateDagerMedFravær(dagerMedDelvisFravær, perioderMedFravær)}>
                {dagerMedDelvisFravær.map((dag, index) => (
                    <DagerMedDelvisFraværListItem
                        name={name}
                        key={index}
                        index={index}
                        dag={dag}
                        onRemove={onRemove}
                        disabledDager={dagerMedDelvisFravær.filter((d) => d !== dag)}
                    />
                ))}
            </FormikInputGroup>
            <FormBlock margin="m">
                <Knapp type="standard" htmlType={'button'} onClick={onCreateNew} mini={true}>
                    Legg til ny dag med delvis fravær
                </Knapp>
            </FormBlock>
        </>
    );
};
export default DagerMedDelvisFraværList;
