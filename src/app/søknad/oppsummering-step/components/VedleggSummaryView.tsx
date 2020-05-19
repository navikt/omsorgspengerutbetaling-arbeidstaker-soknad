import * as React from 'react';
import { useIntl } from 'react-intl';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import Box from 'common/components/box/Box';
import {
    filterArbeidsforholdMedVedlegg,
    listAlleVedleggFraArbeidsforhold,
    listOfAttachmentsToListOfDocumentName
} from '../../../utils/formToApiMaps/mapVedleggToApiData';
import SummaryList from 'common/components/summary-list/SummaryList';
import SummaryBlock from './SummaryBlock';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../../types/ArbeidsforholdTypes';
import { Attachment } from 'common/types/Attachment';
import AttachmentList from 'common/components/attachment-list/AttachmentList';

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

    const listeAvAlleAttachmentsFraArbeidsforhold: Attachment[] = filterArbeidsforholdMedVedlegg([
        ...values[SøknadFormField.arbeidsforhold],
        values[SøknadFormField.annetArbeidsforhold]
    ])
        .map((arbeidsforhold: ArbeidsforholdFormData) => arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter])
        .flat();

    if (listeAvAlleVedlegg.length > 0) {
        return (
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.legend')}>
                <SummaryList
                    items={listeAvAlleVedlegg}
                    itemRenderer={(vedleggNavn) => {
                        return <Box>{vedleggNavn}</Box>;
                    }}
                />
                <AttachmentList attachments={listeAvAlleAttachmentsFraArbeidsforhold} />
            </SummaryBlock>
        );
    }
    return null;
};

export default VedleggSummaryView;
