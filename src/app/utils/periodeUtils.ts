import { AppFieldValidationErrors } from '../validation/fieldValidations';
import { createFieldValidationError } from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';

export const erHelg = (date: Date): boolean => {
    const dayName = date.getDay();
    return dayName === 0 || dayName === 6;
};

export const validatePeriodeNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_periode) : undefined;

export const validateFraværDelerAvDagNotWeekend = (date: Date): FieldValidationResult =>
    erHelg(date) ? createFieldValidationError(AppFieldValidationErrors.ikke_lørdag_eller_søndag_dag) : undefined;
