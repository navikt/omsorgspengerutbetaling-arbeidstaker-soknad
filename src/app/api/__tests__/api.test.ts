import axios from 'axios';
import axiosConfig from '../../config/axiosConfig';
import { ResourceType } from '../../types/ResourceType';
import { getApiUrlByResourceType } from '../../utils/apiUtils';
import { getSøker, sendApplication } from '../api';

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
});
