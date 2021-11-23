import { Person, SøkerApiResponse } from '../types/Søkerdata';

export const søkerApiResponseToPerson = (søkerApiResponse: SøkerApiResponse): Person => {
    return {
        fornavn: søkerApiResponse.fornavn,
        mellomnavn: søkerApiResponse.mellomnavn,
        etternavn: søkerApiResponse.etternavn,
        fødselsnummer: søkerApiResponse.fødselsnummer,
    };
};
