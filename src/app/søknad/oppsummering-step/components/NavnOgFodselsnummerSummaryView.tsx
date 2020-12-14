import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import { formatName } from 'common/utils/personUtils';

export interface Props {
    fornavn?: string;
    etternavn?: string;
    mellomnavn?: string;
    fødselsnummer: string;
}

export const NavnOgFodselsnummerSummaryView: React.FC<Props> = (props: Props): JSX.Element => {
    const { fornavn, etternavn, mellomnavn, fødselsnummer } = props;
    return (
        <Box margin={'l'}>
            {fornavn && etternavn && <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>}
            <Normaltekst>Fødselsnummer: {fødselsnummer}</Normaltekst>
        </Box>
    );
};

export default NavnOgFodselsnummerSummaryView;
