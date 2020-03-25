import axios from 'axios';
import axiosConfig from '../../config/axiosConfig';
import { ResourceType } from '../../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../../utils/apiUtils';
import { deleteFile, getSøker, sendApplication, uploadFile } from '../api';

const mockedApiUrl = 'nav.no/api';
jest.mock('./../../utils/apiUtils', () => {
    return {
        getApiUrlByResourceType: jest.fn(() => mockedApiUrl),
        sendMultipartPostRequest: jest.fn()
    };
});

describe('api', () => {
    describe('getSøker', () => {
        it('should call axios.get with correct URL and axios config', () => {
            getSøker();
            expect(axios.get).toHaveBeenCalledWith(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);
        });
    });

    describe('sendApplication', () => {
        it('should call axios.post with correct URL, specified api data and axios config', () => {
            const data = {} as any;
            sendApplication(data);
            expect(axios.post).toHaveBeenCalledWith(
                getApiUrlByResourceType(ResourceType.SEND_SØKNAD),
                data,
                axiosConfig
            );
        });
    });

    describe('uploadFile', () => {
        it('should send a multipart request with the specified file in a FormData object', () => {
            const fileMock = new File([''], 'filename', { type: 'text/png' });
            uploadFile(fileMock);
            expect(sendMultipartPostRequest).toHaveBeenCalled();
        });
    });

    describe('deleteFile', () => {
        it('should call axios.delete on the specified url', () => {
            deleteFile(mockedApiUrl);
            expect(axios.delete).toHaveBeenCalledWith(mockedApiUrl, axiosConfig);
        });
    });
});
