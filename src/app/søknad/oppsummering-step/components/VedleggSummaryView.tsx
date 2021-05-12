import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import Box from 'common/components/box/Box';
import SummaryList from 'common/components/summary-list/SummaryList';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../../types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getAlleUtbetalingsperioder } from '../../../utils/arbeidsforholdUtils';
import {
    filterArbeidsforholdMedVedlegg,
    listAlleVedleggFraArbeidsforhold,
    listOfAttachmentsToListOfDocumentName,
} from '../../../utils/formToApiMaps/mapVedleggToApiData';
import { harFraværPgaSmittevernhensyn } from '../../../utils/periodeUtils';
import SummaryBlock from './SummaryBlock';

const VedleggSummaryView = (): React.ReactElement | null => {
    const intl = useIntl();

    const { values } = useFormikContext<SøknadFormData>();
    const allePerioder = getAlleUtbetalingsperioder(values);

    const listeAvAlleVedlegg: string[] = [
        ...listAlleVedleggFraArbeidsforhold([
            ...values[SøknadFormField.arbeidsforhold],
            values[SøknadFormField.annetArbeidsforhold],
        ]),
        ...(harFraværPgaSmittevernhensyn(allePerioder)
            ? listOfAttachmentsToListOfDocumentName(values[SøknadFormField.dokumenterSmittevernhensyn])
            : []),
    ];

    const listeAvAlleAttachmentsFraArbeidsforhold: Attachment[] = filterArbeidsforholdMedVedlegg([
        ...values[SøknadFormField.arbeidsforhold],
        values[SøknadFormField.annetArbeidsforhold],
    ])
        .map((arbeidsforhold: ArbeidsforholdFormData) => arbeidsforhold[ArbeidsforholdFormDataFields.dokumenter])
        .flat();

    if (listeAvAlleVedlegg.length > 0) {
        return (
            <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.dokumenter.legend')}>
                <SummaryList
                    items={listeAvAlleVedlegg}
                    itemRenderer={(vedleggNavn: any): JSX.Element => {
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
