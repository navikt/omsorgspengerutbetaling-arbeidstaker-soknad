import * as React from 'react';
import { StepID } from '../config/stepConfig';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadFormData } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';

const Søknad: React.FC = (): JSX.Element => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(
            søkerdata: Søkerdata,
            formData: SøknadFormData,
            lastStepID: StepID | undefined
        ): JSX.Element => {
            return (
                <SøknadFormComponents.FormikWrapper
                    initialValues={formData}
                    onSubmit={(): null => null}
                    renderForm={(formikProps): JSX.Element => {
                        return <SøknadRoutes søkerdata={søkerdata} lastStepID={lastStepID} formikProps={formikProps} />;
                    }}
                />
            );
        }}
    />
);

export default Søknad;
