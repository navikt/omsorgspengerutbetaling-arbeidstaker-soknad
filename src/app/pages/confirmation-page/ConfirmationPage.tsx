import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler/lib';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { Person } from '../../types/Søkerdata';
import { SøknadApiData } from '../../types/SøknadApiData';
import TilArbeidsgiverDokumentListe from './components/TilArbeidsgiverDokumentListe';
import './confirmationPage.less';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { useEffect, useState } from 'react';

const bem = bemUtils('confirmationPage');

export interface Props {
    søker: Person | undefined;
    søknadApiData: SøknadApiData | undefined;
    resetForm: () => void;
}

const ConfirmationPage: React.FC<Props> = ({ søker, søknadApiData, resetForm }: Props): JSX.Element => {
    const intl = useIntl();
    const [formReset, setFormReset] = useState<boolean>(false);

    useLogSidevisning(SIFCommonPageKey.kvittering);

    useEffect(() => {
        if (!formReset) {
            resetForm();
            setFormReset(true);
        }
    }, [formReset, resetForm]);

    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>
                        <FormattedMessage id="page.confirmation.tittel" />
                    </Innholdstittel>
                </Box>
            </div>
            <Box margin="xl">
                <div className={'infopanelInfoForsvinner'}>
                    <Undertittel>
                        <FormattedMessage id="page.confirmation.undertittel" />
                    </Undertittel>
                    <Panel border={true} className={'luftOver'}>
                        <AlertStripe type="advarsel" form="inline">
                            <Box padBottom={'l'}>
                                <FormattedMessage id="page.conformation.alert.infoForsvinner" />
                            </Box>
                            <Box>
                                <FormattedMessage id="page.conformation.alert.infoPrint" />
                            </Box>
                        </AlertStripe>
                    </Panel>
                </div>

                <ul className="checklist">
                    <li>
                        <AlertStripe type="info" form="inline">
                            <FormattedHtmlMessage id="page.conformation.alert.info.1.html" />
                        </AlertStripe>
                    </li>
                    <li>
                        <AlertStripe type="info" form="inline">
                            <FormattedHtmlMessage id="page.conformation.alert.info.2.html" />
                        </AlertStripe>
                    </li>
                    <li>
                        <AlertStripe type="info" form="inline">
                            <FormattedMessage id="page.conformation.alert.info.3" />
                        </AlertStripe>
                    </li>
                </ul>
            </Box>

            <Box margin="xl" padBottom={'xl'}>
                <div className={'skrivUtKnapp'}>
                    <Knapp
                        type={'hoved'}
                        onClick={(): boolean => {
                            window.print();
                            return false;
                        }}>
                        <FormattedMessage id="page.conformation.skrivUtKnapp" />
                    </Knapp>
                </div>
            </Box>
            <Box padBottom={'xl'}>
                <div className={'kviteringsBlokk'}>
                    <FormattedMessage id="page.conformation.skrivUt.info" />
                </div>
            </Box>

            {søker && søknadApiData && <TilArbeidsgiverDokumentListe søker={søker} søknadApiData={søknadApiData} />}
        </Page>
    );
};

export default ConfirmationPage;
