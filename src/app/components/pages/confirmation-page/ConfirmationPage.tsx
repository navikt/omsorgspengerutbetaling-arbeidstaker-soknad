import * as React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import './confirmationPage.less';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { ArbeidsgiverDetaljer, SøknadApiData, Utbetalingsperiode } from '../../../types/SøknadApiData';
import { Søkerdata } from '../../../types/Søkerdata';
import { formatName } from 'common/utils/personUtils';
import Panel from 'nav-frontend-paneler/lib';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';
import { iso8601DurationToTime, isValidTime, timeToString } from 'common/utils/timeUtils';
import { Time } from 'common/types/Time';
import TilArbeidsgiverDokument from './components/TilArbeidsgiverDokument';
import TilArbeidsgiverDokumentListe from './components/TilArbeidsgiverDokumentListe';

const bem = bemUtils('confirmationPage');

export interface OwnProps {
    søkerdata: Søkerdata | undefined;
    søknadApiData: SøknadApiData | undefined;
}

const ConfirmationPage = (props: OwnProps): JSX.Element => {
    const { søkerdata, søknadApiData } = props;
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
                <div className={'infopanelInfoForsvinner'}>
                    <Undertittel>
                        <FormattedMessage id="page.confirmation.undertittel" />
                    </Undertittel>
                    <Panel border={true} className={'luftOver'}>
                        <AlertStripe type="advarsel" form="inline">
                            <Box padBottom={'l'}>
                                Obs! Denne informasjonen forsvinner når du lukker den. Det er derfor viktig at du leser
                                gjennom før du går videre.
                            </Box>
                            <Box>Siden kan printes ut, slik at du kan gi utskrift til arbeidsgiveren din.</Box>
                        </AlertStripe>
                    </Panel>
                </div>

                <ul className="checklist">
                    <li>
                        <AlertStripe type="info" form="inline">
                            <b>Dette er en bekreftelse på at vi har mottatt søknaden din. </b> På grunn av stor pågang
                            er det vanskelig å si når søknaden vil bli synlig for deg på Ditt NAV.
                            <p>Når søknaden din er ferdigbehandlet, får du et svar fra oss.</p>
                        </AlertStripe>
                    </li>
                    <li>
                        <AlertStripe type="info" form="inline">
                            Du må be arbeidsgiver om å sende inntektsmelding til oss. Det er viktig at arbeidsgiver
                            krysser av for at inntektsmeldingen gjelder omsorgspenger.
                            <p>Vi kontakter deg hvis vi trenger flere opplysninger i saken din.</p>
                        </AlertStripe>
                    </li>
                    <li>
                        <AlertStripe type="info" form="inline">
                            Du kan skrive ut denne informasjonssiden og gi utskriften til arbeidsgiveren din. Hvis du er
                            registrert med flere arbeidsgivere, får du en utskrift til hver av dem.
                        </AlertStripe>
                    </li>
                </ul>
            </Box>

            <Box margin="xl" padBottom={'xl'}>
                <div className={'skrivUtKnapp'}>
                    <Knapp
                        type={'hoved'}
                        onClick={() => {
                            window.print();
                            return false;
                        }}>
                        Skriv ut denne siden nå
                    </Knapp>
                </div>
            </Box>
            <Box padBottom={'xl'}>
                <div className={'kviteringsBlokk'}>
                    Hvis du ikke kan skrive ut denne informasjonssiden, kan du ta bilde av den. Husk også å ta bilde av
                    informasjonen som kommer under, som du kan gi til arbeidsgiver.
                </div>
            </Box>

            {søkerdata && søknadApiData && (
                <TilArbeidsgiverDokumentListe søkerdata={søkerdata} søknadApiData={søknadApiData} />
            )}
        </Page>
    );
};

export default ConfirmationPage;
