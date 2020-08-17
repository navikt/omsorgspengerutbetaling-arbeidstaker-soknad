import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';

export interface PersistenceInterface<StorageFormat, ResponseFormat = any> {
    persist: (data: StorageFormat) => Promise<AxiosResponse<ResponseFormat>>;
    rehydrate: () => Promise<AxiosResponse<StorageFormat>>;
    purge: () => Promise<AxiosResponse>;
}

export interface PersistenceConfig {
    requestConfig: AxiosRequestConfig;
    url: string;
}

const dateStringToDateObjectMapper = (_: string, value: string): string | Date => {
    if (moment(value, moment.ISO_8601).isValid()) {
        return new Date(value);
    }
    return value;
};

const storageParser = (storageResponse: string): object | void => {
    if (storageResponse) {
        return JSON.parse(storageResponse, dateStringToDateObjectMapper);
    }
};

function persistence<StorageFormat>({ requestConfig, url }: PersistenceConfig): PersistenceInterface<StorageFormat> {
    return {
        persist: (data: StorageFormat): Promise<AxiosResponse<any>> => {
            return Axios.post(url, data, requestConfig);
        },
        rehydrate: (): Promise<AxiosResponse<any>> => {
            return Axios.get(url, { ...requestConfig, transformResponse: storageParser });
        },
        purge: (): Promise<AxiosResponse<any>> => {
            return Axios.delete(url, { ...requestConfig, data: {} });
        },
    };
}

export default persistence;
