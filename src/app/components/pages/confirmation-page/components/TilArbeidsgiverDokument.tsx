import * as React from 'react';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { ArbeidsgiverDetaljer, Utbetalingsperiode } from '../../../../types/SøknadApiData';
import { Time } from 'common/types/Time';
import { iso8601DurationToTime, isValidTime } from 'common/utils/timeUtils';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';
import Box from 'common/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { utbetalingsperiodeDagToDagSummaryStringView } from '../../../../søknad/oppsummering-step/components/UtbetalingsperioderSummaryView';

interface Props {
    arbeidsgiverDetaljer: ArbeidsgiverDetaljer;
    key: number;
    søkersNavn: string;
    søknadNavn: string;
}

const isoDurationToMaybeTime = (value: string | null): Time | undefined => {
    if (value) {
        const partialTimeOrUndefined: Partial<Time> | undefined = iso8601DurationToTime(value);
        const maybeTime: Time | undefined = isValidTime(partialTimeOrUndefined)
            ? { ...partialTimeOrUndefined }
            : undefined;
        return maybeTime;
    }
    return undefined;
};

const TilArbeidsgiverDokument: React.FC<Props> = ({ arbeidsgiverDetaljer, søkersNavn, søknadNavn }: Props) => {
    return (
        <div className={'pagebreak tilArbeidsgiverPanel'}>
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
                        {søkersNavn} søker om {søknadNavn} for periodene:
                    </b>
                </p>
                {arbeidsgiverDetaljer.perioder.length > 0 && (
                    <ul>
                        {arbeidsgiverDetaljer.perioder.map((periode: Utbetalingsperiode, i: number) => {
                            const maybePlanlagt: Time | undefined = isoDurationToMaybeTime(periode.antallTimerPlanlagt);
                            const maybeBorte: Time | undefined = isoDurationToMaybeTime(periode.antallTimerBorte);
                            return maybePlanlagt && maybeBorte ? (
                                <li key={`delvisDag-${i}`}>
                                    {utbetalingsperiodeDagToDagSummaryStringView({
                                        dato: periode.fraOgMed,
                                        antallTimerPlanlagt: maybePlanlagt,
                                        antallTimerBorte: maybeBorte,
                                    })}
                                </li>
                            ) : (
                                <li key={`periode-${i}`}>
                                    {prettifyDateExtended(apiStringDateToDate(periode.fraOgMed))} -{' '}
                                    {prettifyDateExtended(apiStringDateToDate(periode.tilOgMed))}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Panel border={true} className={'luftOver'}>
                    <AlertStripe type="advarsel" form="inline">
                        <Box padBottom={'l'}>
                            For at arbeidstaker skal få raskt svar på søknaden sin, ber vi om at inntektsmeldingen blir
                            sendt til oss så snart som mulig.
                        </Box>
                        <Box padBottom={'l'}>
                            <b>Det er viktig at du krysser av for at inntektsmeldingen gjelder {søknadNavn}.</b>
                        </Box>
                        <Box>Hvis inntektsmeldingen allerede er sendt, kan du se bort fra denne meldingen.</Box>
                    </AlertStripe>
                </Panel>

                <div>
                    <h4>Slik sender du inntektsmeldingen</h4>

                    <p>
                        Inntektsmeldingen sendes fra arbeidsgivers eget lønns- og personalsystem eller fra altinn.no.
                        Meldingen inneholder inntektsopplysninger og annen informasjon NAV må ha for å behandle søknaden
                        arbeidstaker har sendt. Husk å velge riktig inntektsmelding.
                    </p>
                    <p>
                        Fyll inn alle dager og/eller perioder som samsvarer med arbeidstakers søknad. Hvis søknaden ikke
                        stemmer med hva dere har avtalt, må dere avklare dette dere imellom før du sender
                        inntektsmeldingen.
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
};

export default TilArbeidsgiverDokument;
