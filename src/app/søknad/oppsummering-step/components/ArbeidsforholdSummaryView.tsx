import * as React from 'react';
import { ArbeidsgiverDetaljer, OrganisasjonDetaljer } from '../../../types/SøknadApiData';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import intlHelper from 'common/utils/intlUtils';
import SummaryList from 'common/components/summary-list/SummaryList';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import './arbeidsforholdSummary.less';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    arbeidsgivere: ArbeidsgiverDetaljer[];
}

const bem = bemUtils('arbeidsforholdSummary');

const ArbeidsforholdSummaryView: React.FC<Props> = (props: Props) => {
    const intl = useIntl();
    const { arbeidsgivere } = props;

    return (
        <Box margin="xl">
            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
                {arbeidsgivere.length > 0 ? (
                    <SummaryList
                        items={arbeidsgivere}
                        itemRenderer={(organisasjon: OrganisasjonDetaljer) => {
                            const orgInfo = {
                                navn: organisasjon.navn,
                                organisasjonsnummer: organisasjon.organisasjonsnummer
                            };
                            return (
                                <div key={organisasjon.organisasjonsnummer}>
                                    <div className={bem.element('org')}>
                                        <FormattedMessage id="arbeidsforhold.oppsummering.orgInfo" values={orgInfo} />
                                    </div>
                                    <Box margin={'s'}>
                                        <SummaryBlock header={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}>
                                            <JaNeiSvar harSvartJa={organisasjon.harHattFraværHosArbeidsgiver} />
                                        </SummaryBlock>
                                    </Box>
                                    {organisasjon.harHattFraværHosArbeidsgiver && (
                                        <Box margin={'s'}>
                                            <SummaryBlock
                                                header={intlHelper(
                                                    intl,
                                                    'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                                )}>
                                                <JaNeiSvar harSvartJa={organisasjon.arbeidsgiverHarUtbetaltLønn} />
                                            </SummaryBlock>
                                        </Box>
                                    )}
                                </div>
                            );
                        }}
                    />
                ) : (
                    <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
                )}
            </ContentWithHeader>
        </Box>
    );
};

export default ArbeidsforholdSummaryView;
