import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Ingress, Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { KvitteringInfo } from '../../../søknad/SøknadRoutes';
import './confirmationPage.less';
import { Panel } from 'nav-frontend-paneler';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';

const bem = bemUtils('confirmationPage');

interface Props {
    numberOfArbeidsforhold: number;
    kvitteringInfo?: KvitteringInfo;
}

const ConfirmationPage: React.FunctionComponent<Props> = ({ kvitteringInfo }) => {
    const intl = useIntl();
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
                <Ingress>
                    <FormattedMessage id="page.confirmation.undertittel" />
                </Ingress>

                <Panel border={true} className={'luftOver'}>
                    <AlertStripe type="advarsel" form="inline">
                        Obs! Denne informasjonen forsvinner når du lukker den. Det er derfor viktig at du leser gjennom
                        før du går videre.
                        <div>Siden kan printes ut, slik at du kan gi utskrift til arbeidsgiveren din.</div>
                    </AlertStripe>
                </Panel>
                <ul className="checklist">
                    <li>
                        <b>Dette er en bekreftelse på at vi har mottatt søknaden din. </b> På grunn av stor pågang er
                        det vanskelig å si når søknaden vil bli synlig for deg på Ditt NAV.
                        <p>Når søknaden din er ferdigbehandlet, får du et svar fra oss.</p>
                    </li>
                    <li>
                        Du må be arbeidsgiver om å sende inntektsmelding til oss. Det er viktig at arbeidsgiver krysser
                        av for at inntektsmeldingen gjelder omsorgspenger.
                        <p>Vi kontakter deg hvis vi trenger flere opplysninger i saken din.</p>
                    </li>
                    <li>
                        Du kan skrive ut denne informasjonssiden og gi utskriften til arbeidsgiveren din. Hvis du er
                        registrert med flere arbeidsgivere, får du en utskrift til hver av dem.
                    </li>
                </ul>
                <div className={'skrivUtKnapp'}>
                    <Knapp type={'hoved'}>Skriv ut denne siden nå</Knapp>
                </div>
                <div className={'kviteringsBlokk'}>
                    Hvis du ikke kan skrive ut denne informasjonssiden, kan du ta bilde av den. Husk også å ta bilde av
                    informasjonen som kommer under, som du kan gi til arbeidsgiver.
                </div>

                <Panel border={true} className={'luftOver'}>
                    <Undertittel>
                        Til Arbeidsgiver 2AS
                        {/*TODO: Fullfør ihht design og insert info om arbeidsgiver*/}
                        <p>kommer...</p>
                    </Undertittel>
                </Panel>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
