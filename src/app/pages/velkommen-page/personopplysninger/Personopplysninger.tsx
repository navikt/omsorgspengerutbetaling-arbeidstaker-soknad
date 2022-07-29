import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <Systemtittel tag="h1">
                <FormattedMessage id="modal.personalopplysninger.tittel" />
            </Systemtittel>
            <Box margin="xl">
                <FormattedMessage id="modal.personalopplysninger.intro.1" />
            </Box>
            <Box margin="xl">
                <Ingress tag="h2">
                    <FormattedMessage id="modal.personalopplysninger.opplysninger.tittel" />
                </Ingress>
                <p>
                    <FormattedMessage id="modal.personalopplysninger.opplysninger.part1" />
                </p>
                <ul>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.opplysninger.1" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.opplysninger.2" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.opplysninger.3" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.opplysninger.4" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.opplysninger.5" />
                    </li>
                </ul>
                <p>
                    <FormattedMessage id="modal.personalopplysninger.opplysninger.part2" />
                </p>
            </Box>

            <Box margin="xl">
                <Ingress tag="h2">
                    <FormattedMessage id="modal.personalopplysninger.svar.tittel" />
                </Ingress>
                <p>
                    <FormattedMessage id="modal.personalopplysninger.svar.part1" />
                </p>
                <ul>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.svar.1" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.svar.2" />
                    </li>
                    <li>
                        <FormattedMessage id="modal.personalopplysninger.svar.3" />
                    </li>
                </ul>
            </Box>
            <Box margin="xl">
                <Ingress tag="h2">
                    <FormattedMessage id="modal.personalopplysninger.personvern.tittel" />
                </Ingress>
                <p>
                    <FormattedMessage id="modal.personalopplysninger.personvern.part1a" />
                    {` `}
                    <Lenke href={getLenker(intl.locale).personvern} target="_blank">
                        <FormattedMessage id="modal.personalopplysninger.personvern.part1b" />
                    </Lenke>
                </p>
            </Box>
        </>
    );
};

export default BehandlingAvPersonopplysningerContent;
