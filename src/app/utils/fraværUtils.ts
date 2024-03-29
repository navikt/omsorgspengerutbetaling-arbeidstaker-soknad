import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import MinMax from 'dayjs/plugin/minMax';

dayjs.extend(MinMax);

export const getÅrstallFromFravær = (
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
export const getTidsromFromÅrstall = (årstall?: number): DateRange => {
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
