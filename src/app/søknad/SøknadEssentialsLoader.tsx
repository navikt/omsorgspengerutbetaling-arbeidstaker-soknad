import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getSøker, redirectIfUnauthorized } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import { StepID } from '../config/stepConfig';
import { isSøkerApiResponse, isSøkerdata, SøkerApiResponse, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage, TemporaryStorageVersion as CurrentTemporaryStorageVersion } from '../types/TemporaryStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import SøknadTempStorage from './SøknadTempStorage';
import { søkerApiResponseToPerson } from '../utils/typeUtils';
import GeneralErrorPage from '../components/pages/general-error-page/GeneralErrorPage';
import { WillRedirect } from '../types/types';
import { isSøknadFormData } from '../types/SøknadFormDataTypeGuards';
import appSentryLogger from '../utils/appSentryLogger';
import { isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';
import IkkeTilgangPage from '../components/pages/ikke-tilgang-page/IkkeTilgangPage';

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
    hasNoAccess?: boolean;
}

const initialState: State = {
    isLoading: true,
    lastStepID: undefined,
    formData: initialValues,
};

const isTempStorageValid = (tempStorage: TemporaryStorage): boolean => {
    return (
        Object.keys(tempStorage).length === 0 ||
        (tempStorage.formData && tempStorage.metadata?.version === CurrentTemporaryStorageVersion)
    );
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
                if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                    const [søkerApiResponse, tempStorage] = await Promise.all([
                        getSøker(),
                        SøknadTempStorage.rehydrate(),
                    ]);
                    /** Kontroller om mellomlagring er ok */
                    const tempStorageIsValid = tempStorage.data !== undefined && isTempStorageValid(tempStorage.data);
                    if (!tempStorageIsValid) {
                        await SøknadTempStorage.purge();
                    }
                    handleSøkerdataFetchSuccess(søkerApiResponse, tempStorageIsValid ? tempStorage : undefined);
                } else {
                    const søkerApiResponse: AxiosResponse<SøkerApiResponse> = await getSøker();
                    handleSøkerdataFetchSuccess(søkerApiResponse);
                }
            } catch (error) {
                const willRedirect = redirectIfUnauthorized(error);
                if (isForbidden(error)) {
                    setState({ ...state, hasNoAccess: true, isLoading: false });
                } else if (willRedirect === WillRedirect.No) {
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
    if (state.hasNoAccess) {
        return <IkkeTilgangPage />;
    }
    return <LoadingPage />;
};

export default SøknadEssentialsLoader;
