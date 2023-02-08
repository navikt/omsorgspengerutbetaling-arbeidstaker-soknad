import { AxiosResponse } from 'axios';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { ArbeidsgiverResponse } from '../types/Søkerdata';
import api from './api';
import { failure } from '@devexperts/remote-data-ts';

export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<ArbeidsgiverResponse>> => {
    try {
        return api.get<ArbeidsgiverResponse>(ApiEndpoint.ARBEIDSGIVER, `fra_og_med=${fom}&til_og_med=${tom}`);
    } catch (error) {
        return Promise.reject(failure(error));
    }
};
