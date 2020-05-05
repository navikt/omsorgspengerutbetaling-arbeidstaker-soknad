import * as React from 'react';
import IkkeMyndigPage from '../components/pages/ikke-myndig-page/IkkeMyndigPage';
import { SøknadFormData } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';
import { StepID } from '../config/stepConfig';
import { Søkerdata } from '../types/Søkerdata';

const Søknad = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(søkerdata: Søkerdata, formData: SøknadFormData, lastStepID: StepID | undefined) => {
            if (!søkerdata.person.myndig) {
                return <IkkeMyndigPage />;
            }
            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={formData}
                    onSubmit={() => null}
                    renderForm={(formikProps) => (
                        <SøknadRoutes søkerdata={søkerdata} lastStepID={lastStepID} formikProps={formikProps} />
                    )}
                />
            );
        }}
    />
);

export default Søknad;
