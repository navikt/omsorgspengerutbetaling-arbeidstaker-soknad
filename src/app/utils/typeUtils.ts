import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Barn, BarnApiResponse, Person, SøkerApiResponse } from '../types/Søkerdata';

export const søkerApiResponseToPerson = (søkerApiResponse: SøkerApiResponse): Person => {
    return {
        fornavn: søkerApiResponse.fornavn,
        mellomnavn: søkerApiResponse.mellomnavn,
        etternavn: søkerApiResponse.etternavn,
        fødselsnummer: søkerApiResponse.fødselsnummer,
        myndig: søkerApiResponse.myndig,
    };
};

export const barnApiResponseToPerson = (barnRemoteData: BarnApiResponse): Barn[] => {
    return barnRemoteData.barnOppslag?.map((b) => ({
        aktørId: b.aktørId,
        etternavn: b.etternavn,
        mellomnavn: b.mellomnavn || undefined,
        fornavn: b.fornavn,
        fødselsdato: apiStringDateToDate(b.fødselsdato),
    }));
};
