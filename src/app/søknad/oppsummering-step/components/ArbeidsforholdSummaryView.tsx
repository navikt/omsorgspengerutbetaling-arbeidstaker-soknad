import * as React from 'react';
import Box from 'common/components/box/Box';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import './arbeidsforholdSummary.less';
import JaNeiSvar from './JaNeiSvar';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from './SummaryBlock';
import { ArbeidsgiverDetaljer, Begrunnelse } from '../../../types/SøknadApiData';
import { getRadioTextIdHvorLengeJobbetFordi } from '../../../components/formik-arbeidsforhold/FormikArbeidsforholdArbeidslengde';
import { begrunnelseTilHvorLengeJobbetFordi } from '../../../utils/formToApiMaps/mapAnsettelseslengdeToApiData';
import UtbetalingsperioderSummaryView from './UtbetalingsperioderSummaryView';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { skalInkludereArbeidsforhold } from '../../../validation/components/arbeidsforholdValidations';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../../types/ArbeidsforholdTypes';
import { Attachment } from 'common/types/Attachment';
import AttachmentList from 'common/components/attachment-list/AttachmentList';

const bem = bemUtils('arbeidsforholdSummary');

export const getRadioTextIdBegrunnelseFordi = (begrunnelse: Begrunnelse): string => {
    return getRadioTextIdHvorLengeJobbetFordi(begrunnelseTilHvorLengeJobbetFordi(begrunnelse), true);
};

const maybeArbeidsforholdToAttachmentList = (
    arbeidsforholdFormData: ArbeidsforholdFormData | undefined
): Attachment[] | undefined =>
    arbeidsforholdFormData ? arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter] : undefined;

interface Props {
    listeAvArbeidsforhold: ArbeidsgiverDetaljer[];
}

const ArbeidsforholdSummaryView: React.FC<Props> = ({ listeAvArbeidsforhold }: Props): React.ReactElement => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const listeAvGjeldendeArbeidsforhold: ArbeidsforholdFormData[] = [
        ...values[SøknadFormField.arbeidsforhold],
        values[SøknadFormField.annetArbeidsforhold],
    ].filter(skalInkludereArbeidsforhold);

    return (
        <Box margin={'l'}>
            {listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsgiverDetaljer, index: number) => {
                const orgInfo = {
                    navn: arbeidsforhold.navn,
                    organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
                };

                const kreverVedlegg = arbeidsforhold.ansettelseslengde.merEnn4Uker;
                const maybeListOfAttachments: Attachment[] | undefined = maybeArbeidsforholdToAttachmentList(
                    listeAvGjeldendeArbeidsforhold.find(
                        (a: ArbeidsforholdFormData) => a[ArbeidsforholdFormDataFields.navn] === arbeidsforhold.navn
                    )
                );

                return (
                    <Box key={index} padBottom={'xl'}>
                        {/* Title */}
                        <div className={bem.element('org')}>
                            {orgInfo.navn}{' '}
                            {orgInfo.organisasjonsnummer && <>(organisasjonsnummer: {orgInfo.organisasjonsnummer})</>}
                        </div>
                        {/* Content */}
                        <div className={'arbeidsforholdSummaryContent'}>
                            <Box margin={'s'}>
                                <SummaryBlock header={intlHelper(intl, 'arbeidsforhold.harHattFravær.spm')}>
                                    <JaNeiSvar harSvartJa={arbeidsforhold.harHattFraværHosArbeidsgiver} />
                                </SummaryBlock>
                            </Box>
                            {arbeidsforhold.harHattFraværHosArbeidsgiver && (
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                        )}>
                                        <JaNeiSvar harSvartJa={arbeidsforhold.arbeidsgiverHarUtbetaltLønn} />
                                    </SummaryBlock>
                                </Box>
                            )}
                            {/* ansettelsesLengde */}

                            <Box margin={'s'}>
                                <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.hvorLengeJobbet.spørsmål')}>
                                    {arbeidsforhold.ansettelseslengde.merEnn4Uker === true && (
                                        <FormattedMessage id={'hvorLengeJobbet.mer'} />
                                    )}
                                    {arbeidsforhold.ansettelseslengde.merEnn4Uker === false && (
                                        <FormattedMessage id={'hvorLengeJobbet.mindre'} />
                                    )}
                                </SummaryBlock>
                            </Box>

                            {/* Mindre enn 4 uker */}
                            {!arbeidsforhold.ansettelseslengde.merEnn4Uker &&
                                arbeidsforhold.ansettelseslengde.begrunnelse &&
                                !arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring && (
                                    <Box margin={'s'}>
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.hvorLengeJobbet.fordi.legend-text'
                                            )}>
                                            <FormattedMessage
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
                                                'steg.oppsummering.hvorLengeJobbet.fordi.ingen.forklaring.label'
                                            )}>
                                            {arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring}
                                        </SummaryBlock>
                                    </Box>
                                )}

                            {kreverVedlegg && (
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.dokumenter.header')}>
                                        {maybeListOfAttachments && maybeListOfAttachments.length > 0 ? (
                                            <AttachmentList attachments={maybeListOfAttachments} />
                                        ) : (
                                            <i>Ikke lastet opp, må ettersendes</i>
                                        )}
                                    </SummaryBlock>
                                </Box>
                            )}

                            {/* Periode */}
                            <UtbetalingsperioderSummaryView utbetalingsperioder={arbeidsforhold.perioder} />
                        </div>
                    </Box>
                );
            })}
        </Box>
    );
};

export default ArbeidsforholdSummaryView;
