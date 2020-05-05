import * as React from 'react';
import { FormattedMessage, useIntl, WrappedComponentProps } from 'react-intl';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../information/behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../information/dine-plikter-modal/DinePlikterModal';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'>;

const WelcomingPage = (props: Props) => {

    const intl = useIntl();
    const [visDinePlikterModal, setVisDinePlikterModal] = React.useState(false);
    const [visBehandlingAvPersonopplysningerModal, setVisBehandlingAvPersonopplysningerModal] = React.useState(false);

    const { onValidSubmit } = props;

    return (
        <>
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={() => (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                            normalText: intlHelper(intl, 'welcomingPage.banner.tekst')
                        }}
                    />
                )}>
                <Box margin="xxl">
                    <Sidetittel className={bem.element('title')}>
                        <FormattedMessage id="welcomingPage.introtittel" />
                    </Sidetittel>
                </Box>
                <SamtykkeForm
                    onOpenDinePlikterModal={() => setVisDinePlikterModal(true)}
                    openBehandlingAvPersonopplysningerModal={() => setVisBehandlingAvPersonopplysningerModal(true)}
                    onConfirm={onValidSubmit}
                />
            </Page>

            <DinePlikterModal
                isOpen={visDinePlikterModal}
                onRequestClose={() => setVisDinePlikterModal(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
            />
            <BehandlingAvPersonopplysningerModal
                isOpen={visBehandlingAvPersonopplysningerModal}
                onRequestClose={() => setVisBehandlingAvPersonopplysningerModal(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
            />
        </>
    );
};

export default WelcomingPage;
