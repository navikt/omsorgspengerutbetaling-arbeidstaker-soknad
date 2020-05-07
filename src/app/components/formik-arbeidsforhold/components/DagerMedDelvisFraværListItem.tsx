import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Knapp } from 'nav-frontend-knapper';
import { GYLDIG_TIDSROM } from '../../../validation/constants';
import { validateAll, validateDateInRange, validateDateNotInFuture } from '../../../validation/fieldValidations';
import FraværTimerSelect from './FraværTimerSelect';
import { FormikDatepicker } from '@navikt/sif-common-formik/lib';
import { FraværDelerAvDag, Periode } from '../../../types/PeriodeTypes';

interface Props {
    name: string;
    index: number;
    dag: FraværDelerAvDag;
    disabledDager?: FraværDelerAvDag[];
    disabledPerioder?: Periode[];
    onRemove?: (index: number) => void;
}

const bem = bemUtils('dagerMedDelvisFravarListItem');

export const pluralize = (count: number, single: string, other: string) => (count === 1 ? single : other);

const getFjernLabel = (dato?: Date, timer?: number): string => {
    const timerTekst: string | undefined = timer
        ? `${timer} ${pluralize(timer === 1 ? 1 : 2, 'time', 'timer')}`
        : undefined;

    if (dato && timerTekst) {
        return `Fjern dag med delvis fravær (${prettifyDate(dato)}, ${timerTekst})`;
    }
    if (dato) {
        return `Fjern dag med delvis fravær (${prettifyDate(dato)}, antall timer ikke valgt)`;
    }
    if (timerTekst) {
        return `Fjern dag med delvis fravær (dato ikke valgt, ${timerTekst} valgt)`;
    }
    return 'Fjern dag med delvis fravær (dato og antall timer ikke valgt)';
};

const DagerMedDelvisFraværListItem: React.FunctionComponent<Props> = ({
    name,
    index,
    dag,
    disabledDager,
    onRemove
}) => {
    const ugyldigeTidsperioder = disabledDager
        ?.filter((d) => d.dato)
        .map((d) => ({
            fom: d.dato,
            tom: d.dato
        }));
    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('firstRow', index === 0))}>
            <div className={bem.element('dateWrapper')}>
                <FormikDatepicker
                    label="Dato"
                    validate={validateAll([
                        validateRequiredField,
                        validateDateInRange(GYLDIG_TIDSROM),
                        validateDateNotInFuture()
                    ])}
                    name={`${name}.${index}.dato`}
                    dateLimitations={{
                        minDato: GYLDIG_TIDSROM.from,
                        maksDato: dateToday,
                        ugyldigeTidsperioder
                    }}
                />
            </div>
            <div className={bem.element('hoursWrapper')}>
                <FraværTimerSelect name={name} index={index} />
            </div>
            {onRemove && (
                <div className={bem.element('deleteButtonWrapper')}>
                    <Knapp
                        mini={true}
                        htmlType="button"
                        onClick={() => onRemove(index)}
                        form="kompakt"
                        aria-label={getFjernLabel(dag.dato, dag.timer)}>
                        Fjern
                    </Knapp>
                </div>
            )}
        </div>
    );
};

export default DagerMedDelvisFraværListItem;
