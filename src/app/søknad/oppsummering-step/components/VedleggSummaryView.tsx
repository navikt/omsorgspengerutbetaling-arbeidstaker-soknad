import * as React from 'react';
import { useIntl } from 'react-intl';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { useFormikContext } from 'formik';
import { SøknadFormData } from '../../../types/SøknadFormData';

interface Props {
    apiValues: SøknadApiData;
}

const VedleggSummaryView: React.FC<Props> = ({ apiValues }: Props) => {
    const intl = useIntl();

    const { values, setFormikState } = useFormikContext<SøknadFormData>();

    return <div>Vedlegg TBD</div>;
};

export default VedleggSummaryView;
