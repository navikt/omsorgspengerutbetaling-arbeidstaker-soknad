import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { BostedUtland } from '@navikt/sif-common-forms/lib';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { Bosted } from '../../types/SøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): Bosted => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom),
    erEØSLand: countryIsMemberOfEøsOrEfta(opphold.landkode)
});
