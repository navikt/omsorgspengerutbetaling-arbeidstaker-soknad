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
                <Box margin="xl">{settInnTilArbeidsgiverPaneler(intl, søkerdata, søknadApiData)}</Box>
            )}
        </Page>
    );
};

const settInnTilArbeidsgiverPaneler = (
    intl: IntlShape,
    søkerdata: Søkerdata,
    søknadApiData: SøknadApiData
): JSX.Element => {
    const { fornavn, mellomnavn, etternavn } = søkerdata.person;
    const søkersNavn: string | undefined =
        fornavn && etternavn ? formatName(fornavn, etternavn, mellomnavn || undefined) : 'UKJENT BRUKER';
    const søknadsNavn = 'omsorgspenger';

    const componentList = søknadApiData.arbeidsgivere.map(
        (arbeidsgiverDetaljer: ArbeidsgiverDetaljer, index: number) => {
            return (
                <div className={'pagebreak tilArbeidsgiverPanel'} key={`arbeidsgiver-${index}`}>
                    <Panel border={true} className={'luftOver'}>
                        <Undertittel>Til {arbeidsgiverDetaljer.navn}</Undertittel>

                        <p>NAV har mottatt følgende opplysninger:</p>

                        <p>
                            <b>
                                {søkersNavn} er ansatt hos {arbeidsgiverDetaljer.navn}
                            </b>
                        </p>
                        <p>
                            <b>
                                {søkersNavn} søker om {søknadsNavn} for periodene:
                            </b>
                        </p>
                        {arbeidsgiverDetaljer.perioder.length > 0 && (
                            <ul>
                                {arbeidsgiverDetaljer.perioder.map((periode: Utbetalingsperiode, i: number) => {
                                    const lengde = periode.lengde;
                                    const maybeValidTime = lengde ? iso8601DurationToTime(lengde) : undefined;
                                    return (
                                        <li key={`periode-${i}`}>
                                            {prettifyDateExtended(apiStringDateToDate(periode.fraOgMed))} -{' '}
                                            {lengde && isValidTime(maybeValidTime)
                                                ? timeToString(maybeValidTime, intl, true)
                                                : prettifyDateExtended(apiStringDateToDate(periode.tilOgMed))}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <Panel border={true} className={'luftOver'}>
                            <AlertStripe type="advarsel" form="inline">
                                <Box padBottom={'l'}>
                                    For at arbeidstaker skal få raskt svar på søknaden sin, ber vi om at
                                    inntektsmeldingen blir sendt til oss så snart som mulig.
                                </Box>
                                <Box padBottom={'l'}>
                                    <b>
                                        Det er viktig at du krysser av for at inntektsmeldingen gjelder {søknadsNavn}.
                                    </b>
                                </Box>
                                <Box>Hvis inntektsmeldingen allerede er sendt, kan du se bort fra denne meldingen.</Box>
                            </AlertStripe>
                        </Panel>

                        <div>
                            <h4>Slik sender du inntektsmeldingen</h4>

                            <p>
                                Inntektsmeldingen sendes fra arbeidsgivers eget lønns- og personalsystem eller fra
                                altinn.no. Meldingen inneholder inntektsopplysninger og annen informasjon NAV må ha for
                                å behandle søknaden arbeidstaker har sendt. Husk å velge riktig inntektsmelding.
                            </p>
                            <p>
                                Fyll inn alle dager og/eller perioder som samsvarer med arbeidstakers søknad. Hvis
                                datoen ikke stemmer med hva dere har avtalt, må dere avklare dette dere imellom før du
                                sender inntektsmeldingen.
                            </p>
                            <p>
                                Du får mer informasjon om inntektsmeldingen på{' '}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                        'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding'
                                    }>
                                    nav.no/inntektsmeldingen
                                </a>
                            </p>
                        </div>
                    </Panel>
                </div>
            );
        }
    );

    return <div>{componentList}</div>;
};

export default ConfirmationPage;
