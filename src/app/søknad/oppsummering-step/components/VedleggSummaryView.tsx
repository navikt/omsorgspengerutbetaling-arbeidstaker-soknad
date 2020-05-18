import * as React from 'react';
import { useIntl } from 'react-intl';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import Box from 'common/components/box/Box';
import {
    listAlleVedleggFraArbeidsforhold,
    listOfAttachmentsToListOfDocumentName
} from '../../../utils/formToApiMaps/mapVedleggToApiData';
import SummaryList from 'common/components/summary-list/SummaryList';
import SummaryBlock from './SummaryBlock';
import { YesOrNo } from 'common/types/YesOrNo';

interface Props {
    apiValues: SøknadApiData;
}

const VedleggSummaryView: React.FC<Props> = ({ apiValues }: Props) => {
    const intl = useIntl();

    const { values, setFormikState } = useFormikContext<SøknadFormData>();

    const listeAvAlleVedlegg: string[] = [
        ...listAlleVedleggFraArbeidsforhold([
            ...values[SøknadFormField.arbeidsforhold],
            values[SøknadFormField.annetArbeidsforhold]
        ]),
        ...(values[SøknadFormField.hjemmePgaSmittevernhensynYesOrNo] === YesOrNo.YES
            ? listOfAttachmentsToListOfDocumentName(values[SøknadFormField.smittevernDokumenter])
            : [])
    ];

    if (listeAvAlleVedlegg.length > 0) {
        return (
            <SummaryBlock header={'Vedlegg til søknad: Forklaring fra arbeidsgiver'}>
                <SummaryList
                    items={listeAvAlleVedlegg}
                    itemRenderer={(vedleggNavn) => {
                        return <Box>{vedleggNavn}</Box>;
                    }}
                />
            </SummaryBlock>
        );
    }
    return null;
};

export default VedleggSummaryView;
