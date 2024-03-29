import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import SøknadTempStorage from '../SoknadTempStorage';
import { Person } from '../../types/Søkerdata';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';

interface Props {
    søker: Person;
    soknadId: string;
}

const LegeerklæringDokumenterStep: React.FC<Props> = ({ søker, soknadId }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[SøknadFormField.dokumenterLegeerklæring] : [];
    }, [values]);

    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
    const ref = React.useRef({ attachments });

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            const formValues = { ...values, dokumenterLegeerklæring: attachments };
            setFieldValue(SøknadFormField.dokumenterLegeerklæring, attachments);
            SøknadTempStorage.update(soknadId, formValues, StepID.DOKUMENTER_LEGEERKLÆRING, {
                søker,
            });
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, soknadId, søker, values]);

    return (
        <SoknadFormStep
            id={StepID.DOKUMENTER_LEGEERKLÆRING}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <FormBlock>
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.1" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.2" />
                    </Box>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.vedlegg_legeerklæring.counsellorpanel.3" />{' '}
                        <Lenke target={'_blank'} rel={'noopener noreferrer'} href={getLenker().ettersending}>
                            <FormattedMessage id={'step.vedlegg_legeerklæring.counsellorpanel.3.lenkeEttersending'} />
                        </Lenke>
                    </Box>
                </CounsellorPanel>
            </FormBlock>
            <FormBlock>
                <PictureScanningGuide />
            </FormBlock>
            <FormikVedleggsKomponent
                uploadButtonLabel={intlHelper(intl, 'step.vedlegg_legeerklæring.uploadBtn')}
                formikName={SøknadFormField.dokumenterLegeerklæring}
                dokumenter={values.dokumenterLegeerklæring}
                alleDokumenterISøknaden={alleDokumenterISøknaden}
            />
        </SoknadFormStep>
    );
};

export default LegeerklæringDokumenterStep;
