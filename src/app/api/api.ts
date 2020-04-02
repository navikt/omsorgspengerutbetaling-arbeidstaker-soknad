import axios, { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { SøknadApiData } from '../types/SøknadApiData';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ArbeidsgiverResponse } from '../types/Søkerdata';

export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);

export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<ArbeidsgiverResponse>> =>
    axios.get(`${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`, axiosConfig);

export const sendApplication = (data: SøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosConfig);
