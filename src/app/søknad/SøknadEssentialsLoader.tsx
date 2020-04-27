import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getSøker } from '../api/api';
import LoadingPage from '../components/pages/loading-page/LoadingPage';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { StepID } from '../config/stepConfig';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import { Arbeidsgiver, Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { TemporaryStorage } from '../types/TemporaryStorage';
import * as apiUtils from '../utils/apiUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import SøknadTempStorage from './SøknadTempStorage';

interface Props {
    contentLoadedRenderer: (
        søkerdata: Søkerdata | undefined,
        formData: SøknadFormData | undefined,
        lastStepID: StepID | undefined
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    lastStepID?: StepID;
    formData: SøknadFormData;
    søkerdata?: Søkerdata;

}

const initialState: State = { isLoading: true, lastStepID: undefined, formData: initialValues };

// extends React.Component<Props, State>
const SøknadEssentialsLoader = (props: Props) => {

    const [state, setState]: [State, React.Dispatch<React.SetStateAction<State>>] = React.useState(initialState);

    React.useEffect(() => {
        if (isLoading) {
            loadAppEssentials();
        }
    }, [state]);


    async function loadAppEssentials() {
        try {
            if (isFeatureEnabled(Feature.MELLOMLAGRING)) {
                const [søkerResponse, tempStorage] = await Promise.all([getSøker(), SøknadTempStorage.rehydrate()]);
                handleSøkerdataFetchSuccess(søkerResponse, tempStorage);
            } else {
                const søkerResponse = await getSøker();
                handleSøkerdataFetchSuccess(søkerResponse);
            }
        } catch (response) {
            handleSøkerdataFetchError(response);
        }
    }

    const handleSøkerdataFetchSuccess = (søkerResponse: AxiosResponse, tempStorageResponse?: AxiosResponse) => {
        const tempStorage: TemporaryStorage | undefined = tempStorageResponse?.data;
        const søknadFormData = tempStorage?.formData;
        const maybeStoredLastStepID = tempStorage?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata = {
            person: søkerResponse.data,
            setArbeidsgivere: updateArbeidsgivere,
            arbeidsgivere: []
        };

        setState({
            isLoading: false,
            lastStepID: maybeStoredLastStepID,
            formData: søknadFormData || { ...initialValues },
            søkerdata: updatedSokerData ? updatedSokerData : state.søkerdata
        });
        // callback
        //     () => {
        //         stopLoading();
        //         if (userIsCurrentlyOnErrorPage()) {
        //             window.location.assign(getRouteUrl(routeConfig.WELCOMING_PAGE_ROUTE));
        //         }
        //     }
    };

    const stopLoading = () => {
        setState({
            ...state,
            isLoading: false
        });
    };

    const handleSøkerdataFetchError = (response: AxiosError) => {
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            window.location.assign(getRouteUrl(routeConfig.ERROR_PAGE_ROUTE));
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(stopLoading, 200);
    };

    const updateArbeidsgivere = (arbeidsgivere: Arbeidsgiver[]) => {
        const { person, setArbeidsgivere } = state.søkerdata!; // TODO: Få fjernet !
        setState({
            ...state,
            søkerdata: {
                setArbeidsgivere,
                arbeidsgivere,
                person
            }
        });
    };

    const { contentLoadedRenderer } = props;
    const { isLoading, søkerdata, formData, lastStepID } = state;

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <SøkerdataContextProvider value={søkerdata}>
                {contentLoadedRenderer(søkerdata, formData, lastStepID)}
            </SøkerdataContextProvider>
        </>
    );
};

export default SøknadEssentialsLoader;
