import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getBarn, getSøker, redirectIfForbiddenOrUnauthorized } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import { StepID } from '../config/stepConfig';
import { BarnApiResponse, isSøkerApiResponse, isSøkerdata, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage, TemporaryStorageVersion as CurrentTemporaryStorageVersion } from '../types/TemporaryStorage';
import SøknadTempStorage from './SøknadTempStorage';
import { barnApiResponseToPerson, søkerApiResponseToPerson } from '../utils/typeUtils';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import { WillRedirect } from '../types/types';
import { isSøknadFormData } from '../types/SøknadFormDataTypeGuards';
import appSentryLogger from '../utils/appSentryLogger';

interface Props {
    contentLoadedRenderer: (
        søkerdata: Søkerdata,
        formData: SøknadFormData,
        lastStepID: StepID | undefined
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    formData: SøknadFormData;
    søkerdata?: Søkerdata;
    lastStepID?: StepID;
}

const initialState: State = {
    isLoading: true,
    lastStepID: undefined,
    formData: initialValues,
};

const SøknadEssentialsLoader: React.FC<Props> = (props: Props): JSX.Element => {
    const [state, setState]: [State, React.Dispatch<React.SetStateAction<State>>] = useState(initialState);
    const [apiCallError, setApiCallError] = useState<boolean>(false);
    const { contentLoadedRenderer } = props;
    const { isLoading, søkerdata, formData, lastStepID } = state;
    const [doApiCalls, setDoApiCalls] = useState<boolean>(true);

    const handleSøknadEssentialsFetchSuccess = (
        søkerResponse: AxiosResponse<SøkerApiResponse>,
        barnResponse: AxiosResponse<BarnApiResponse>,
        tempStorageResponse?: AxiosResponse<TemporaryStorage>
    ) => {
        const tempStorage: TemporaryStorage | undefined = tempStorageResponse?.data;
        const tempStorageIsValid =
            tempStorage?.formData && tempStorage?.metadata?.version === CurrentTemporaryStorageVersion;
        const søknadFormData: SøknadFormData | undefined | any = tempStorageIsValid ? tempStorage?.formData : undefined;
        const maybeStoredLastStepID: StepID | undefined | any = tempStorageIsValid
            ? tempStorage?.metadata?.lastStepID
            : undefined;

        const updatedSokerData: Søkerdata | undefined = isSøkerApiResponse(søkerResponse.data)
            ? {
                  person: søkerApiResponseToPerson(søkerResponse.data),
                  barn: barnApiResponseToPerson(barnResponse.data),
              }
            : undefined;

        setState({
            isLoading: false,
            lastStepID: isSøknadFormData(søknadFormData) ? maybeStoredLastStepID : undefined,
            formData: isSøknadFormData(søknadFormData) ? søknadFormData : { ...initialValues },
            søkerdata: updatedSokerData,
        });
        if (!isSøkerApiResponse(søkerResponse.data)) {
            setApiCallError(true);
            appSentryLogger.logError('søkerApiResponse invalid (SøknadEssentialsLoader)');
        }
    };

    useEffect(() => {
        async function loadAppEssentials(): Promise<void> {
            try {
                const [søkerApiResponse, barnApiResponse, tempStorage]: Array<
                    AxiosResponse<SøkerApiResponse> | AxiosResponse<BarnApiResponse> | AxiosResponse<TemporaryStorage>
                > = await Promise.all([getSøker(), getBarn(), SøknadTempStorage.rehydrate()]);
                handleSøknadEssentialsFetchSuccess(søkerApiResponse, barnApiResponse, tempStorage);
            } catch (error) {
                const willRedirect = redirectIfForbiddenOrUnauthorized(error);
                if (willRedirect === WillRedirect.No) {
                    setApiCallError(true);
                    appSentryLogger.logApiError(error);
                } else {
                    setState({ ...state, isLoading: true });
                }
            }
        }
        if (doApiCalls) {
            loadAppEssentials();
            setDoApiCalls(false);
        }
    }, [state, doApiCalls]);

    if (isSøkerdata(søkerdata) && isSøknadFormData(formData) && !isLoading) {
        return <>{contentLoadedRenderer(søkerdata, formData, lastStepID)}</>;
    }
    if (apiCallError) {
        return <GeneralErrorPage cause={'apiCallError set in SøknadEssestialsLoader'} />;
    }
    return <LoadingPage />;
};

export default SøknadEssentialsLoader;
