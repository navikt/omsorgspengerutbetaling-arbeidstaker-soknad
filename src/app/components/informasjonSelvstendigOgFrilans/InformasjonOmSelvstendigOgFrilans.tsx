import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { FormattedMessage } from 'react-intl';

export interface Props {
    erSelvstendig: boolean;
    erFrilanser: boolean;
}

const InformasjonOmSelvstendigOgFrilans: React.FC<Props> = ({ erSelvstendig, erFrilanser }: Props) => {
    return erSelvstendig || erFrilanser ? (
        <FormBlock margin={'m'}>
            <AlertStripeInfo>
                <>
                    {erSelvstendig && (
                        <Box padBottom={erFrilanser ? 'l' : undefined}>
                            <FormattedMessage
                                id={'selvstendig_og_eller_frilans.frilans.ja.info'}
                                values={{
                                    lenkeKomponent: (
                                        <a
                                            href="https://www.nav.no/familie/sykdom-i-familien/soknad/omsorgspengerutbetaling"
                                            className="lenke"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            <FormattedMessage
                                                id={'selvstendig_og_eller_frilans.selvstendig.ja.info.lenketekst'}
                                            />
                                        </a>
                                    ),
                                }}
                            />
                        </Box>
                    )}

                    {erFrilanser && (
                        <Box>
                            <FormattedMessage
                                id={'selvstendig_og_eller_frilans.selvstendig.ja.info'}
                                values={{
                                    lenkeKomponent: (
                                        <a
                                            href="https://www.nav.no/familie/sykdom-i-familien/soknad/omsorgspengerutbetaling"
                                            className="lenke"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            <FormattedMessage
                                                id={'selvstendig_og_eller_frilans.selvstendig.ja.info.lenketekst'}
                                            />
                                        </a>
                                    ),
                                }}
                            />
                        </Box>
                    )}
                </>
            </AlertStripeInfo>
        </FormBlock>
    ) : null;
};

export default InformasjonOmSelvstendigOgFrilans;
