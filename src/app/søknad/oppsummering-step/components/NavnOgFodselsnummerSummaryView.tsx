import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import { formatName } from 'common/utils/personUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

export interface Props {
    fornavn?: string;
    etternavn?: string;
    mellomnavn?: string;
    fødselsnummer: string;
}

export const NavnOgFodselsnummerSummaryView: React.FC<Props> = (props: Props): JSX.Element => {
    const { fornavn, etternavn, mellomnavn, fødselsnummer } = props;
    const intl = useIntl();
    return (
        <Box margin={'l'}>
            {fornavn && etternavn && <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>}
            <Normaltekst>{intlHelper(intl, `steg.oppsummering.søker.fnr`, { fødselsnummer })}</Normaltekst>
        </Box>
    );
};

export default NavnOgFodselsnummerSummaryView;
