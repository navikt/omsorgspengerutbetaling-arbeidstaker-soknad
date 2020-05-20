import { Søkerdata } from '../../../../types/Søkerdata';
import { ArbeidsgiverDetaljer, SøknadApiData } from '../../../../types/SøknadApiData';
import { formatName } from 'common/utils/personUtils';
import TilArbeidsgiverDokument from './TilArbeidsgiverDokument';
import * as React from 'react';
import Box from 'common/components/box/Box';

interface Props {
    søkerdata: Søkerdata;
    søknadApiData: SøknadApiData;
}

const TilArbeidsgiverDokumentListe: React.FC<Props> = ({ søkerdata, søknadApiData }: Props): JSX.Element => {
    const { fornavn, mellomnavn, etternavn } = søkerdata.person;
    const søkersNavn: string | undefined =
        fornavn && etternavn ? formatName(fornavn, etternavn, mellomnavn || undefined) : 'UKJENT BRUKER';
    const søknadsNavn = 'omsorgspenger';

    return (
        <Box margin="xl">
            {søknadApiData.arbeidsgivere.map((arbeidsgiverDetaljer: ArbeidsgiverDetaljer, index: number) => {
                return (
                    <TilArbeidsgiverDokument
                        arbeidsgiverDetaljer={arbeidsgiverDetaljer}
                        key={index}
                        søkersNavn={søkersNavn}
                        søknadNavn={søknadsNavn}
                    />
                );
            })}
        </Box>
    );
};

export default TilArbeidsgiverDokumentListe;
