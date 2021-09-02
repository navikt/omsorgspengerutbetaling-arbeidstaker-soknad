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
import { FormattedMessage } from 'react-intl';

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

                <p>
                    <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.tittel" />
                </p>

                <p>
                    <b>
                        <FormattedMessage
                            id="page.conformation.tilArbeidsgiverDokument.1"
                            values={{
                                søkersNavn: søkersNavn,
                                arbeidsgiversNavn: arbeidsgiverDetaljer.navn,
                            }}
                        />
                    </b>
                </p>
                <p>
                    <b>
                        <FormattedMessage
                            id="page.conformation.tilArbeidsgiverDokument.2"
                            values={{
                                søkersNavn: søkersNavn,
                                søknadNavn: søknadNavn,
                            }}
                        />
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
                            <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.alert.1" />
                        </Box>
                        <Box padBottom={'l'}>
                            <b>
                                <FormattedMessage
                                    id="page.conformation.tilArbeidsgiverDokument.alert.2"
                                    values={{
                                        søknadNavn: søknadNavn,
                                    }}
                                />
                            </b>
                        </Box>
                        <Box>
                            <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.alert.3" />
                        </Box>
                    </AlertStripe>
                </Panel>

                <div>
                    <h4>
                        <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.info.tittel" />
                    </h4>

                    <p>
                        <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.info.2" />
                    </p>
                    <p>
                        <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.info.3" />{' '}
                        <a
                            className="lenke"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={
                                'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding'
                            }>
                            <FormattedMessage id="page.conformation.tilArbeidsgiverDokument.info.4.lenkeTekst" />
                        </a>
                    </p>
                </div>
            </Panel>
        </div>
    );
};

export default TilArbeidsgiverDokument;
