import * as React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { Ingress, Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import './confirmationPage.less';
import { Panel } from 'nav-frontend-paneler';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { SøknadApiData } from '../../../types/SøknadApiData';
import { Søkerdata } from '../../../types/Søkerdata';
import { formatName } from 'common/utils/personUtils';

const bem = bemUtils('confirmationPage');

export interface OwnProps {
    søkerdata: Søkerdata | undefined;
    søknadApiData: SøknadApiData | undefined;
}

const ConfirmationPage = (props: OwnProps): JSX.Element => {
    const { søkerdata, søknadApiData } = props;
    const intl = useIntl();

    // const apiData: SøknadApiData = mock1;

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
                            registrert med flere arbeidsgivere, får du en utskrift til hver av dem. Du kan skrive ut
                            denne informasjonssiden og gi utskriften til arbeidsgiveren din. Hvis du er
                        </AlertStripe>
                    </li>
                </ul>
            </Box>

            <Box margin="xl">
                <div className={'skrivUtKnapp'}>
                    <Knapp
                        type={'hoved'}
                        onClick={() => {
                            window.print();
                            return false;
                        }}
                    >
                        Skriv ut denne siden nå
                    </Knapp>
                </div>
                <div className={'kviteringsBlokk'}>
                    Hvis du ikke kan skrive ut denne informasjonssiden, kan du ta bilde av den. Husk også å ta bilde av
                    informasjonen som kommer under, som du kan gi til arbeidsgiver.
                </div>
            </Box>

            {søkerdata && søknadApiData && <Box margin="xl">{settInnTilArbeidsgiverPaneler(søkerdata, søknadApiData, intl)}</Box>}
        </Page>
    );
};

const settInnTilArbeidsgiverPaneler = (
    søkerdata: Søkerdata,
    apiData: SøknadApiData,
    intl: IntlShape
): JSX.Element[] => {
    const { fornavn, mellomnavn, etternavn } = søkerdata.person;
    const søkersNavn: string = formatName(fornavn, etternavn, mellomnavn);
    const søknadsNavn = 'omsorgspenger';
    const startdato = 'TODO:startdato';

    // const a: string[] = apiData.utbetalingsperioder.map((periode) => {
    //     return 'Fra og med:' + periode.fraOgMed + '. Til og med: ' + periode.tilOgMed + '.';
    // });

    const listeAvTilArbeidsgiverPaneler: JSX.Element[] = apiData.arbeidsgivere.organisasjoner.map(
        (organisasjon, index) => {
            const arbeidsgiverNavn = organisasjon.navn;

            return (
                <div key={`tilArbeidsgiverPaneler_${index}`} className={'pagebreak tilArbeidsgiverPanel'}>
                    <Panel border={true} className={'luftOver'}>
                        <Undertittel>Til {arbeidsgiverNavn}</Undertittel>

                        <p>NAV har mottatt følgende opplysninger:</p>

                        <p>
                            <b>
                                {søkersNavn} er ansatt hos {arbeidsgiverNavn}{' '}
                            </b>
                        </p>
                        <p>
                            <b>
                                {søkersNavn} søker om {søknadsNavn} for perioden:
                            </b>
                        </p>
                        <ul>
                            <li>
                                <b>- TODO: 1.apr 2020 til 1. april.</b>
                            </li>
                        </ul>
                        <Panel border={true} className={'luftOver'}>
                            <AlertStripe type="advarsel" form="inline">
                                For at arbeidstaker skal få raskt svar på søknaden sin, ber vi om at inntektsmeldingen
                                blir sendt til oss så snart som mulig.
                                <p>
                                    <b>
                                        Det er viktig at du krysser av for at inntektsmeldingen gjelder {søknadsNavn}.
                                    </b>
                                </p>
                                <div>Hvis inntektsmeldingen allerede er sendt, kan du se bort fra denne meldingen.</div>
                            </AlertStripe>
                        </Panel>

                        <div>
                            <h4>Slik sender du inntektsmeldingen</h4>

                            <p>
                                Inntektsmeldingen sender fra arbeidsgivers eget lønns- og personalsystem eller fra
                                altinn.no. Meldingen inneholder inntektsopplysninger og annen informasjon NAV må ha for
                                å behandle søknaden arbeidstaker har sendt. Husk å velge riktig inntektsmelding.
                            </p>
                            <div>
                                Fyll inn startdato som samsvarer med søkers.{' '}
                                <b>
                                    {søkersNavn} har søkt {søknadsNavn} fra {startdato}.
                                </b>
                                Hvis datoen ikke stemmer med hva dere har avtalt, må dere avklare dette dere imellom før
                                du sender inntektsmeldingen.
                                <p>
                                    Du får mer informasjon om inntektsmeldingen på{' '}
                                    <a
                                        href={
                                            'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding'
                                        }>
                                        nav.no/inntektsmeldingen
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Panel>
                </div>
            );
        }
    );

    return listeAvTilArbeidsgiverPaneler;
};

export default ConfirmationPage;
