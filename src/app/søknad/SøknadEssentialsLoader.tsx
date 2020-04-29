import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getSøker, handleSøkerdataFetchError } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import { StepID } from '../config/stepConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { isSøkerdata, Person, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, isSøknadFormData, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import SøknadTempStorage from './SøknadTempStorage';
import { søkerApiResponseToPerson } from '../utils/typeUtils';

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
            handleSøkerdataFetchError(response);
        }
    }

    const handleSøkerdataFetchSuccess = (
        søkerResponse: AxiosResponse<SøkerApiResponse>,
        tempStorageResponse?: AxiosResponse<TemporaryStorage>
    ) => {
        const person: Person = søkerApiResponseToPerson(søkerResponse.data);
        const tempStorage: TemporaryStorage | undefined = tempStorageResponse?.data;
        const søknadFormData: SøknadFormData | undefined | {} = tempStorage?.formData;
        const maybeStoredLastStepID: StepID | undefined | any = tempStorage?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata = {
            person
        };

        setState({
            isLoading: false,
            lastStepID: maybeStoredLastStepID,
            formData: isSøknadFormData(søknadFormData) ? søknadFormData : { ...initialValues },
            søkerdata: updatedSokerData ? updatedSokerData : state.søkerdata
        });
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
    return <LoadingPage />;
};

export default SøknadEssentialsLoader;
