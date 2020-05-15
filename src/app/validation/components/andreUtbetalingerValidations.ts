import { YesOrNo } from 'common/types/YesOrNo';
import { AndreUtbetalinger } from '../../types/AndreUtbetalinger';
import { evaluatePrevAndCurrent } from '../validationUtils';

export const annenUtbetalingIsValid = (annenUtbetaling: AndreUtbetalinger): boolean => {
    if (
        annenUtbetaling &&
        typeof annenUtbetaling === 'string' &&
        (annenUtbetaling === AndreUtbetalinger.dagpenger || annenUtbetaling === AndreUtbetalinger.sykepenger)
    ) {
        return true;
    } else {
        return false;
    }
};

export const andreUtbetalingerIsValid = (andreUtbetalinger: AndreUtbetalinger[]): boolean => {
    return andreUtbetalinger
        .map((annenUtbetaling: AndreUtbetalinger) => {
            return annenUtbetalingIsValid(annenUtbetaling);
        })
        .reduceRight(evaluatePrevAndCurrent);
};

export const andreUtbetalingerFormIsValid = (
    harSøknadAndreUtbetalinger: YesOrNo,
    andreUtbetalinger: AndreUtbetalinger[]
): boolean => {
    if (
        harSøknadAndreUtbetalinger === YesOrNo.NO ||
        (harSøknadAndreUtbetalinger === YesOrNo.YES &&
            andreUtbetalinger.length > 0 &&
            andreUtbetalingerIsValid(andreUtbetalinger))
    ) {
        return true;
    } else {
        return false;
    }
};
