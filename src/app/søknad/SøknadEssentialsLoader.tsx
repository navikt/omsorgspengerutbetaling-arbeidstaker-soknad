import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getSøker, redirectIfForbiddenOrUnauthorized } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import { StepID } from '../config/stepConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { isSøkerApiResponse, isSøkerdata, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, isSøknadFormData, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import SøknadTempStorage from './SøknadTempStorage';
import { søkerApiResponseToPerson } from '../utils/typeUtils';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';

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
    formData: initialValues
};

const SøknadEssentialsLoader = (props: Props) => {
    const [state, setState]: [State, React.Dispatch<React.SetStateAction<State>>] = useState(initialState);
    const [receivedErroFromApi, setReceivedErrorFromApi] = useState<boolean>(false);
    const { contentLoadedRenderer } = props;
    const { isLoading, søkerdata, formData, lastStepID } = state;

    useEffect(() => {
        if (isLoading) {
            loadAppEssentials();
        }
    }, [state]);

    async function loadAppEssentials() {
        try {
            if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                const [søkerApiResponse, tempStorage]: Array<
                    AxiosResponse<SøkerApiResponse> | AxiosResponse<TemporaryStorage>
                > = await Promise.all([getSøker(), SøknadTempStorage.rehydrate()]);
                handleSøkerdataFetchSuccess(søkerApiResponse, tempStorage);
            } else {
                const søkerApiResponse: AxiosResponse<SøkerApiResponse> = await getSøker();
                handleSøkerdataFetchSuccess(søkerApiResponse);
            }
        } catch (response) {
            const willRedirect = redirectIfForbiddenOrUnauthorized(response);
            if (!willRedirect) {
                setReceivedErrorFromApi(true);
            }
        }
    }

    const handleSøkerdataFetchSuccess = (
        søkerResponse: AxiosResponse<SøkerApiResponse>,
        tempStorageResponse?: AxiosResponse<TemporaryStorage>
    ) => {
        const tempStorage: TemporaryStorage | undefined = tempStorageResponse?.data;
        const søknadFormData: SøknadFormData | undefined | {} = tempStorage?.formData;
        const maybeStoredLastStepID: StepID | undefined | any = tempStorage?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata | undefined = isSøkerApiResponse(søkerResponse.data)
            ? {
                  person: søkerApiResponseToPerson(søkerResponse.data)
              }
            : undefined;

        setState({
            isLoading: false,
            lastStepID: maybeStoredLastStepID,
            formData: isSøknadFormData(søknadFormData) ? søknadFormData : { ...initialValues },
            søkerdata: updatedSokerData
        });
        if (!isSøkerApiResponse(søkerResponse.data)) {
            setReceivedErrorFromApi(true);
            // TODO: Log - response from server is not of type SøkerApiResponse
        }
    };

    if (søkerdata && isSøkerdata(søkerdata) && formData && isSøknadFormData(formData) && !isLoading) {
        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(søkerdata, formData, lastStepID)}
                </SøkerdataContextProvider>
            </>
        );
    }
    if (receivedErroFromApi) {
        return <GeneralErrorPage />;
    }

    return <LoadingPage />;
};

export default SøknadEssentialsLoader;
