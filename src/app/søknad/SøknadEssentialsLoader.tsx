import React, { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getSøker } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { isSøkerdata, Person, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, isFormData, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import * as apiUtils from '../utils/apiUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import SøknadTempStorage from './SøknadTempStorage';
import { søkerApiResponseToPerson } from '../utils/typeUtils';

interface Props {
    contentLoadedRenderer: (søkerdata: Søkerdata, formData: SøknadFormData, lastStepID: StepID | undefined) => React.ReactNode;
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
        const søknadFormData: SøknadFormData | undefined = tempStorage?.formData;
        const maybeStoredLastStepID: StepID | undefined | any = tempStorage?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata = {
            person,
            arbeidsgivere: [] // TODO: Må EssentialsLoader få dataen først på steget hvor det blir gjort oppslag?
        };

        setState({
            isLoading: false,
            lastStepID: maybeStoredLastStepID,
            formData: søknadFormData || { ...initialValues },
            søkerdata: updatedSokerData ? updatedSokerData : state.søkerdata
        });
    };

    const handleSøkerdataFetchError = (response: AxiosError) => {
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            window.location.assign(getRouteUrl(routeConfig.ERROR_PAGE_ROUTE));
        }
    };

    if (søkerdata && isSøkerdata(søkerdata) && formData && isFormData(formData) && !isLoading) {
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
