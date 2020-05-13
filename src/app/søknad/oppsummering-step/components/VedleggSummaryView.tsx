import * as React from 'react';
import { useIntl } from 'react-intl';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import Box from 'common/components/box/Box';
import { listAlleVedlegg } from '../../../utils/formToApiMaps/mapVedleggToApiData';
import SummaryList from 'common/components/summary-list/SummaryList';
import SummaryBlock from './SummaryBlock';

interface Props {
    apiValues: SøknadApiData;
}

const VedleggSummaryView: React.FC<Props> = ({ apiValues }: Props) => {
    const intl = useIntl();

    const { values, setFormikState } = useFormikContext<SøknadFormData>();

    const listeAvAlleVedlegg: string[] = listAlleVedlegg(
        [...values[SøknadFormField.arbeidsforhold], values[SøknadFormField.annetArbeidsforhold]]
    );

    if (listeAvAlleVedlegg.length > 0) {
        return (
            <SummaryBlock header={'Vedlegg til søknad: Forklaring fra arbeidsgiver'}>
                <SummaryList items={listeAvAlleVedlegg} itemRenderer={(vedleggNavn) => {
                    return (
                        <Box>
                            { vedleggNavn }
                        </Box>
                    )
                }} />
            </SummaryBlock>
        );
    }
    return null;
};

export default VedleggSummaryView;
