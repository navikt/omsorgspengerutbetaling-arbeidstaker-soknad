import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { FraværDelerAvDag, Periode } from '../../types/PeriodeTypes';

export const perioderIsValid = (harPerioderMedFravær: YesOrNo, perioderMedFravær: Periode[]): boolean =>
    harPerioderMedFravær === YesOrNo.NO || (harPerioderMedFravær === YesOrNo.YES && perioderMedFravær.length > 0);

export const delvisFraværIsValid = (
    harDagerMedDelvisFravær: YesOrNo,
    dagerMedDelvisFravær: FraværDelerAvDag[]
): boolean =>
    harDagerMedDelvisFravær === YesOrNo.NO ||
    (harDagerMedDelvisFravær === YesOrNo.YES && dagerMedDelvisFravær.length > 0);

export const oppholdIsValid = (
    perioderHarVærtIUtlandet: YesOrNo,
    perioderUtenlandsopphold: Utenlandsopphold[]
): boolean =>
    perioderHarVærtIUtlandet === YesOrNo.NO ||
    (perioderHarVærtIUtlandet === YesOrNo.YES && perioderUtenlandsopphold.length > 0);

export const minimumEnUtbetalingsperiode = (
    perioderMedFravær: Periode[],
    dagerMedDelvisFravær: FraværDelerAvDag[]
): boolean => perioderMedFravær.length > 0 || dagerMedDelvisFravær.length > 0;
