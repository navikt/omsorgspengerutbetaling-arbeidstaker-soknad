import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerContent from '../../information/behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import DinePlikterContent from '../../information/dine-plikter-content/DinePlikterContent';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

type Props = Omit<StepConfigProps, 'formValues'>;

const WelcomingPage: React.FC<Props> = (props: Props): JSX.Element => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    useLogSidevisning(SIFCommonPageKey.velkommen);

    const { onValidSubmit } = props;

    return (
        <>
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={(): JSX.Element => (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                            normalText: intlHelper(intl, 'welcomingPage.banner.tekst'),
                        }}
                    />
                )}>
                <Box margin="xxl">
                    <Sidetittel className={bem.element('title')}>
                        <FormattedMessage id="welcomingPage.introtittel" />
                    </Sidetittel>
                </Box>
                <SamtykkeForm
                    onOpenDinePlikterModal={() => setDialogState({ dinePlikterModalOpen: true })}
                    openBehandlingAvPersonopplysningerModal={() =>
                        setDialogState({ behandlingAvPersonopplysningerModalOpen: true })
                    }
                    onConfirm={onValidSubmit}
                />
            </Page>

            <InfoDialog
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={(): void => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </>
    );
};

export default WelcomingPage;
