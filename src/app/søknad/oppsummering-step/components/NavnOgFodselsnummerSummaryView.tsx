import React from 'react';
import { IntlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';

export interface Props {
    intl: IntlShape;
    fornavn?: string;
    etternavn?: string;
    mellomnavn?: string;
    fødselsnummer: string;
}

export const NavnOgFodselsnummerSummaryView: React.FC<Props> = (props: Props): JSX.Element => {
    const { fornavn, etternavn, mellomnavn, intl, fødselsnummer } = props;
    return (
        <Box margin={'xl'}>
            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                {fornavn && etternavn && <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>}
                <Normaltekst>Fødselsnummer: {fødselsnummer}</Normaltekst>
            </ContentWithHeader>
        </Box>
    );
};

export default NavnOgFodselsnummerSummaryView;
