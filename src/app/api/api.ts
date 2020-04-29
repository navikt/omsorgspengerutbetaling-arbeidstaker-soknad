import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { SøknadApiData } from '../types/SøknadApiData';
import { getApiUrlByResourceType, isForbidden, isUnauthorized, sendMultipartPostRequest } from '../utils/apiUtils';
import { ArbeidsgiverResponse, SøkerApiResponse } from '../types/Søkerdata';
import { assignErrorUrl, navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import { WillRedirect } from '../types/types';

export const getSøker: () => Promise<AxiosResponse<SøkerApiResponse>> = () =>
    axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);

export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<ArbeidsgiverResponse>> =>
    axios.get(`${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`, axiosConfig);

export const sendApplication = (data: SøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};

export const deleteFile = (url: string) => axios.delete(url, axiosConfig);

export const redirectIfForbiddenOrUnauthorized = (response: AxiosError): WillRedirect => {
    if (isForbidden(response) || isUnauthorized(response)) {
        navigateToLoginPage();
        return WillRedirect.Yes;
    } else {
        return WillRedirect.No;
    }
};

export const handleSøkerdataFetchError = (response: AxiosError) => {
    if (isForbidden(response) || isUnauthorized(response)) {
        navigateToLoginPage();
    } else if (!userIsCurrentlyOnErrorPage()) {
        assignErrorUrl();
    }
};
