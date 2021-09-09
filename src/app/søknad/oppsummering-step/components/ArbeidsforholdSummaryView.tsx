import * as React from 'react';
import Box from 'common/components/box/Box';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import './arbeidsforholdSummary.less';
import JaNeiSvar from './JaNeiSvar';
import intlHelper from 'common/utils/intlUtils';
import SummaryBlock from './SummaryBlock';
import { ArbeidsgiverDetaljer } from '../../../types/SøknadApiData';
import UtbetalingsperioderSummaryView from './UtbetalingsperioderSummaryView';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields, Utbetalingsårsak } from 'app/types/ArbeidsforholdTypes';
import { SøknadFormData, SøknadFormField } from 'app/types/SøknadFormData';
import { skalInkludereArbeidsforhold } from 'app/validation/components/arbeidsforholdValidations';
import { useFormikContext } from 'formik';
import { Attachment } from 'common/types/Attachment';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

const bem = bemUtils('arbeidsforholdSummary');

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

    const listeAvGjeldendeArbeidsforhold: ArbeidsforholdFormData[] = values[SøknadFormField.arbeidsforhold].filter(
        skalInkludereArbeidsforhold
    );
    const arbeidsgivereUtenFravær = values.arbeidsforhold.filter(
        (arbeidsgiver) =>
            arbeidsgiver.harHattFraværHosArbeidsgiver === YesOrNo.NO ||
            (arbeidsgiver.harHattFraværHosArbeidsgiver === YesOrNo.YES &&
                arbeidsgiver.arbeidsgiverHarUtbetaltLønn === YesOrNo.YES)
    );
    return (
        <Box margin={'l'}>
            {listeAvArbeidsforhold.map((arbeidsforhold: ArbeidsgiverDetaljer, index: number) => {
                const orgInfo = {
                    navn: arbeidsforhold.navn,
                    organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
                };

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
                                <SummaryBlock
                                    header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.harHattFravær.spm')}>
                                    <JaNeiSvar harSvartJa={arbeidsforhold.harHattFraværHosArbeidsgiver} />
                                </SummaryBlock>
                            </Box>
                            {arbeidsforhold.harHattFraværHosArbeidsgiver && (
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'step.oppsummering.arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                        )}>
                                        <JaNeiSvar harSvartJa={arbeidsforhold.arbeidsgiverHarUtbetaltLønn} />
                                    </SummaryBlock>
                                </Box>
                            )}
                            <Box margin={'s'}>
                                <SummaryBlock
                                    header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.utbetalingsårsak.spm')}>
                                    <FormattedMessage
                                        id={`step.oppsummering.arbeidsforhold.utbetalingsårsak.${arbeidsforhold.utbetalingsårsak}`}
                                    />
                                </SummaryBlock>
                            </Box>
                            {arbeidsforhold.utbetalingsårsak === Utbetalingsårsak.nyoppstartetHosArbeidsgiver &&
                                arbeidsforhold.årsakMinde4Uker && (
                                    <Box margin={'s'}>
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'step.oppsummering.arbeidsforhold.årsakMinde4Uker.spm'
                                            )}>
                                            <FormattedMessage
                                                id={`step.oppsummering.arbeidsforhold.årsakMinde4Uker.${arbeidsforhold.årsakMinde4Uker}`}
                                            />
                                        </SummaryBlock>
                                    </Box>
                                )}

                            {arbeidsforhold.utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver && (
                                <Box margin={'s'}>
                                    <Box margin={'s'}>
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'step.oppsummering.arbeidsforhold.konflikt.forklaringTittel'
                                            )}>
                                            <p>{arbeidsforhold.konfliktForklaring}</p>
                                        </SummaryBlock>
                                    </Box>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            'step.oppsummering.arbeidsforhold.konflikt.dokumenter.header'
                                        )}>
                                        {maybeListOfAttachments && maybeListOfAttachments.length > 0 ? (
                                            <AttachmentList attachments={maybeListOfAttachments} />
                                        ) : (
                                            <i>
                                                {' '}
                                                {intlHelper(
                                                    intl,
                                                    'step.oppsummering.arbeidsforhold.konflikt.dokumenter.ikkelastetopp'
                                                )}
                                            </i>
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
            {arbeidsgivereUtenFravær.length > 0 &&
                arbeidsgivereUtenFravær.map(
                    (
                        {
                            navn,
                            organisasjonsnummer,
                            harHattFraværHosArbeidsgiver,
                            arbeidsgiverHarUtbetaltLønn,
                        }: ArbeidsforholdFormData,
                        index: number
                    ) => {
                        return (
                            <Box key={index} padBottom={'xl'}>
                                {/* Title */}
                                <div className={bem.element('org')}>
                                    {navn} {organisasjonsnummer && <>(organisasjonsnummer: {organisasjonsnummer})</>}
                                </div>
                                {/* Content */}
                                <div className={'arbeidsforholdSummaryContent'}>
                                    <Box margin={'s'}>
                                        <SummaryBlock
                                            header={intlHelper(
                                                intl,
                                                'step.oppsummering.arbeidsforhold.harHattFravær.spm'
                                            )}>
                                            <JaNeiSvar harSvartJa={harHattFraværHosArbeidsgiver === YesOrNo.YES} />
                                        </SummaryBlock>
                                    </Box>
                                    {harHattFraværHosArbeidsgiver === YesOrNo.YES && (
                                        <Box margin={'s'}>
                                            <SummaryBlock
                                                header={intlHelper(
                                                    intl,
                                                    'step.oppsummering.arbeidsforhold.harArbeidsgiverUtbetaltDegLønnForOmsorgsdagene.spm'
                                                )}>
                                                <JaNeiSvar harSvartJa={arbeidsgiverHarUtbetaltLønn === YesOrNo.YES} />
                                            </SummaryBlock>
                                        </Box>
                                    )}
                                </div>
                            </Box>
                        );
                    }
                )}
        </Box>
    );
};

export default ArbeidsforholdSummaryView;
