import { StringOrNull } from './types';
import { isString } from 'formik';

export const isStringOrNull = (value: any): value is StringOrNull => {
    return isString(value) || value === null;
};

export function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}
