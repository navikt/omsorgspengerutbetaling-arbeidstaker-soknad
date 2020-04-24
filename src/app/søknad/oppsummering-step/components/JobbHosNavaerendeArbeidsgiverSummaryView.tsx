import * as React from 'react';
import { Begrunnelse, JobbHosNåværendeArbeidsgiver } from '../../../types/SøknadApiData';
import Box from 'common/components/box/Box';
import SummaryBlock from './SummaryBlock';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    data: JobbHosNåværendeArbeidsgiver;
}

export const getTextForBegrunnelse = (intl: IntlShape, begrunnelse: Begrunnelse | null): string | null => {
    switch (begrunnelse) {
        case Begrunnelse.ANNET_ARBEIDSFORHOLD:
            return intlHelper(intl, 'hvorLengeJobbet.fordi.annetArbeidsforhold.label');
        case Begrunnelse.ANDRE_YTELSER:
            return intlHelper(intl, 'hvorLengeJobbet.fordi.andreYtelser.label');
        case Begrunnelse.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON:
            return intlHelper(intl, 'hvorLengeJobbet.fordi.lovbestemtFerie.label');
        case Begrunnelse.MILITÆRTJENESTE:
            return intlHelper(intl, 'hvorLengeJobbet.fordi.militærtjeneste.label');
        default:
            return intlHelper(intl, 'hvorLengeJobbet.fordi.ingen.label');
    }
};

const JobbHosNavaerendeArbeidsgiverSummaryView: React.FC<Props> = (props: Props) => {
    const intl = useIntl();

    const {
        data: { merEnn4Uker, begrunnelse }
    } = props;

    return (
        <Box margin={'xl'}>
            <Box margin={'s'}>
                <SummaryBlock header={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}>
                    <FormattedMessage
                        id={merEnn4Uker ? 'hvorLengeJobbet.mer' : 'hvorLengeJobbet.mindre'}
                        tagName="span"
                    />
                </SummaryBlock>
                {!merEnn4Uker && (
                    <SummaryBlock header={intlHelper(intl, 'hvorLengeJobbet.fordi.legend-part2')}>
                        {getTextForBegrunnelse(intl, begrunnelse)}
                    </SummaryBlock>
                )}
            </Box>
        </Box>
    );
};

export default JobbHosNavaerendeArbeidsgiverSummaryView;
