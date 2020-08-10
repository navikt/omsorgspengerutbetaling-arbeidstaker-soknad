import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getSøker, redirectIfForbiddenOrUnauthorized } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import { StepID } from '../config/stepConfig';
import { isSøkerApiResponse, isSøkerdata, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import SøknadTempStorage from './SøknadTempStorage';
import { søkerApiResponseToPerson } from '../utils/typeUtils';
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

    const handleSøkerdataFetchSuccess = (
        søkerResponse: AxiosResponse<SøkerApiResponse>,
        tempStorageResponse?: AxiosResponse<TemporaryStorage>
    ): void => {
        const tempStorage: TemporaryStorage | undefined = tempStorageResponse?.data;
        const søknadFormData: SøknadFormData | undefined | any = tempStorage?.formData;
        const maybeStoredLastStepID: StepID | undefined | any = tempStorage?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata | undefined = isSøkerApiResponse(søkerResponse.data)
            ? {
                  person: søkerApiResponseToPerson(søkerResponse.data),
              }
            : undefined;

        setState({
            isLoading: false,
            lastStepID: maybeStoredLastStepID,
            formData: isSøknadFormData(søknadFormData) ? søknadFormData : { ...initialValues },
            søkerdata: updatedSokerData,
        });
        if (!isSøkerApiResponse(søkerResponse.data)) {
            setApiCallError(true);
            appSentryLogger.logError('søkerApiResponse invalid (SøknadEssentialsLoader)');
        }
    };

    async function loadAppEssentials(): Promise<void> {
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

    useEffect(() => {
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
