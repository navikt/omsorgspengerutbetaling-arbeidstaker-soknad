import * as React from 'react';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import './arbeidsforholdSummary.less';
import JaNeiSvar from './JaNeiSvar';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from './SummaryBlock';
import { ArbeidsgiverDetaljer, Begrunnelse } from '../../../types/SøknadApiData';
import { getRadioTextIdHvorLengeJobbetFordi } from '../../../components/formik-arbeidsforhold/FormikArbeidsforholdArbeidslengde';
import { begrunnelseTilHvorLengeJobbetFordi } from '../../../utils/formToApiMaps/mapAnsettelseslengdeToApiData';
import { annetStepIsAvailable } from '../../../utils/stepUtils';
import UtbetalingsperioderSummaryView from './UtbetalingsperioderSummaryView';

interface Props {
    listeAvArbeidsforhold: ArbeidsgiverDetaljer[];
}

const bem = bemUtils('arbeidsforholdSummary');

export const getRadioTextIdBegrunnelseFordi = (begrunnelse: Begrunnelse): string => {
    return getRadioTextIdHvorLengeJobbetFordi(begrunnelseTilHvorLengeJobbetFordi(begrunnelse));
};

const ArbeidsforholdSummaryView: React.FC<Props> = ({ listeAvArbeidsforhold }: Props) => {
    const intl = useIntl();

    return (
        <Box margin={'l'}>
            {listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsgiverDetaljer, index: number) => {
                const orgInfo = {
                    navn: arbeidsforhold.navn,
                    organisasjonsnummer: arbeidsforhold.organisasjonsnummer
                };
                return (
                    <Box key={index} padBottom={'xl'}>
                        {/* Title */}
                        <div className={bem.element('org')}>
                            <FormattedMessage id="arbeidsforhold.oppsummering.orgInfo" values={orgInfo}/>
                        </div>
                        {/* Content */}
                        <div className={'arbeidsforholdSummaryContent'}>
                            <Box margin={'s'}>
                                <SummaryBlock header={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}>
                                    <JaNeiSvar harSvartJa={arbeidsforhold.harHattFraværHosArbeidsgiver}/>
                                </SummaryBlock>
                            </Box>
                            {arbeidsforhold.harHattFraværHosArbeidsgiver && (
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                        )}>
                                        <JaNeiSvar harSvartJa={arbeidsforhold.arbeidsgiverHarUtbetaltLønn}/>
                                    </SummaryBlock>
                                </Box>
                            )}
                            {/* ansettelsesLengde */}

                            <Box margin={'s'}>
                                <SummaryBlock header={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}>
                                    {
                                        arbeidsforhold.ansettelseslengde.merEnn4Uker === true && (
                                            <FormattedHTMLMessage id={'hvorLengeJobbet.mer'} />
                                        )
                                    }
                                    {
                                        arbeidsforhold.ansettelseslengde.merEnn4Uker === false && (
                                            <FormattedHTMLMessage id={'hvorLengeJobbet.mindre'} />
                                        )
                                    }
                                </SummaryBlock>
                            </Box>

                            {/* Mindre enn 4 uker */}
                            {!arbeidsforhold.ansettelseslengde.merEnn4Uker &&
                            arbeidsforhold.ansettelseslengde.begrunnelse && (
                                <Box margin={'s'}>
                                    <SummaryBlock header={intlHelper(intl, 'hvorLengeJobbet.fordi.legend-text')}>
                                        <FormattedHTMLMessage
                                            id={getRadioTextIdBegrunnelseFordi(
                                                arbeidsforhold.ansettelseslengde.begrunnelse
                                            )}
                                        />
                                    </SummaryBlock>
                                </Box>
                            )}

                            {!arbeidsforhold.ansettelseslengde.merEnn4Uker &&
                            arbeidsforhold.ansettelseslengde.begrunnelse &&
                            arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring && (
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'hvorLengeJobbet.fordi.ingen.forklaring.summary.label'
                                        )}>
                                        {arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring}
                                    </SummaryBlock>
                                </Box>
                            )}

                            {/* Mer enn 4 uker: TODO: Mvp, kun en liste over alle vedleggene. Ikke per arbeidsforhold */}

                            {/* Periode */}
                            <UtbetalingsperioderSummaryView utbetalingsperioder={arbeidsforhold.perioder}/>
                        </div>
                    </Box>
                );
            })}
        </Box>
    );
};

export default ArbeidsforholdSummaryView;

//
// <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
//     {arbeidsgivere.length > 0 ? (
//         <SummaryList
//             items={arbeidsgivere}
//             itemRenderer={(organisasjon: OrganisasjonDetaljer) => {
//                 const orgInfo = {
//                     navn: organisasjon.navn,
//                     organisasjonsnummer: organisasjon.organisasjonsnummer
//                 };
//                 return (
//                     <div key={organisasjon.organisasjonsnummer}>
//                         <div className={bem.element('org')}>
//                             <FormattedMessage id="arbeidsforhold.oppsummering.orgInfo" values={orgInfo} />
//                         </div>
//                         <Box margin={'s'}>
//                             <SummaryBlock header={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}>
//                                 <JaNeiSvar harSvartJa={organisasjon.harHattFraværHosArbeidsgiver} />
//                             </SummaryBlock>
//                         </Box>
//                         {organisasjon.harHattFraværHosArbeidsgiver && (
//                             <Box margin={'s'}>
//                                 <SummaryBlock
//                                     header={intlHelper(
//                                         intl,
//                                         'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
//                                     )}>
//                                     <JaNeiSvar harSvartJa={organisasjon.arbeidsgiverHarUtbetaltLønn} />
//                                 </SummaryBlock>
//                             </Box>
//                         )}
//                     </div>
//                 );
//             }}
//         />
//     ) : (
//         <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
//     )}
// </ContentWithHeader>
