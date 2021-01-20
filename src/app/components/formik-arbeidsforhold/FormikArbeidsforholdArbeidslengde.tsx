import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikRadioPanelGroup, FormikTextarea, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import { PopoverOrientering } from 'nav-frontend-popover';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { createFieldValidationError, FieldValidationErrors } from 'common/validation/fieldValidations';
import { FieldValidationResult } from 'common/validation/types';
import {
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
} from '../../types/AnsettelseslengdeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import FormikQuestion from '../formik-question/FormikQuestion';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { useFormikContext } from 'formik';
import { SøknadFormData } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';

export const validateHvorLengeJobbetQuestion = (value: HvorLengeJobbet): FieldValidationResult => {
    return value === HvorLengeJobbet.IKKE_BESVART
        ? createFieldValidationError(FieldValidationErrors.påkrevd)
        : undefined;
};

const validateHvorLengeJobbetBegrunnelseRadioGroup = (value: HvorLengeJobbetFordi): FieldValidationResult => {
    return value === HvorLengeJobbetFordi.IKKE_BESVART
        ? createFieldValidationError(FieldValidationErrors.påkrevd)
        : undefined;
};

const validateIngenAvSituasjoneneTekstField = (value: string): FieldValidationResult => {
    return value && typeof value === 'string' && value.length > 0 && value.length < 2000
        ? undefined
        : createFieldValidationError(FieldValidationErrors.påkrevd);
};

export const getRadioTextIdHvorLengeJobbetFordi = (
    hvorLengeJobbetFordi: HvorLengeJobbetFordi,
    oppsummering?: boolean
): string => {
    switch (hvorLengeJobbetFordi) {
        case HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.annetArbeidsforhold.label'
                : 'hvorLengeJobbet.fordi.annetArbeidsforhold.label';
        }
        case HvorLengeJobbetFordi.ANDRE_YTELSER: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.andreYtelser.label'
                : 'hvorLengeJobbet.fordi.andreYtelser.label';
        }
        case HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.lovbestemtFerie.label'
                : 'hvorLengeJobbet.fordi.lovbestemtFerie.label';
        }
        case HvorLengeJobbetFordi.MILITÆRTJENESTE: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.militærtjeneste.label'
                : 'hvorLengeJobbet.fordi.militærtjeneste.label';
        }
        case HvorLengeJobbetFordi.INGEN: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.ingen.label'
                : 'hvorLengeJobbet.fordi.ingen.label';
        }
        case HvorLengeJobbetFordi.IKKE_BESVART: {
            return oppsummering
                ? 'steg.oppsummering.hvorLengeJobbet.fordi.ikkeBesvart.label'
                : 'hvorLengeJobbet.fordi.ikkeBesvart.label';
        }
    }
};

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    nameHvorLengeJobbet: string;
    nameBegrunnelse: string;
    nameForklaring: string;
    nameDokumenter: string;
    putPropsHere?: string;
}

const FormikArbeidsforholdArbeidslengde: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameHvorLengeJobbet,
    nameBegrunnelse,
    nameForklaring,
    nameDokumenter,
}: Props) => {
    const intl = useIntl();

    const hvorLengeJobbet: HvorLengeJobbet =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.hvorLengeJobbet
        ];
    const fordi: HvorLengeJobbetFordi =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.begrunnelse
        ];

    const { values } = useFormikContext<SøknadFormData>();
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    return (
        <>
            <FormBlock margin="none">
                <FormikQuestion
                    firstAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                        value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
                    }}
                    secondAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                        value: HvorLengeJobbet.MER_ENN_FIRE_UKER,
                    }}
                    useTwoColumns={true}
                    name={nameHvorLengeJobbet}
                    legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                    validate={validateHvorLengeJobbetQuestion}
                />
            </FormBlock>

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
                <FormBlock>
                    <FormikRadioPanelGroup
                        radios={[
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD)
                                ),
                                value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.ANDRE_YTELSER)
                                ),
                                value: HvorLengeJobbetFordi.ANDRE_YTELSER,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(
                                        HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                                    )
                                ),
                                value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.MILITÆRTJENESTE)
                                ),
                                value: HvorLengeJobbetFordi.MILITÆRTJENESTE,
                            },
                            {
                                label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.INGEN)),
                                value: HvorLengeJobbetFordi.INGEN,
                            },
                        ]}
                        legend={
                            <div>
                                <p>
                                    <LabelWithInfo infoPlassering={PopoverOrientering.Over}>
                                        {intlHelper(intl, 'hvorLengeJobbet.fordi.legend-header')}
                                    </LabelWithInfo>
                                </p>
                                <div className={'normal-tekst'}>
                                    <FormattedMessage id="hvorLengeJobbet.fordi.legend-text" />
                                </div>
                            </div>
                        }
                        name={nameBegrunnelse}
                        useTwoColumns={false}
                        validate={validateHvorLengeJobbetBegrunnelseRadioGroup}
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && fordi === HvorLengeJobbetFordi.INGEN && (
                <FormBlock>
                    <FormattedMessage id={'arbeidsforhold.hvorLengeJobbet.ingen.helpertext'} />
                    {/* TODO: Dette skaper latency issues :/ */}
                    <FormikTextarea
                        name={nameForklaring}
                        validate={validateIngenAvSituasjoneneTekstField}
                        maxLength={2000}
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                <>
                    <FormBlock>
                        <CounsellorPanel>
                            <Box padBottom={'l'}>
                                <FormattedMessage id={'arbeidslengde.merEnnFireUker.infopanel.1.1'} />
                                <strong>
                                    <FormattedMessage id={'arbeidslengde.merEnnFireUker.infopanel.1.2'} />
                                </strong>
                                <FormattedMessage id={'arbeidslengde.merEnnFireUker.infopanel.1.3'} />
                            </Box>
                            <Box padBottom={'l'}>
                                <FormattedMessage id={'arbeidslengde.merEnnFireUker.infopanel.2'} />
                            </Box>
                            <Box padBottom={'l'}>
                                <FormattedMessage id={'arbeidslengde.merEnnFireUker.infopanel.3'} />
                            </Box>
                        </CounsellorPanel>
                    </FormBlock>
                    <Box margin={'l'}>
                        <PictureScanningGuide />
                    </Box>
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                        formikName={nameDokumenter}
                        dokumenter={arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter]}
                        alleDokumenterISøknaden={alleDokumenterISøknaden}
                    />
                </>
            )}
        </>
    );
};

export default FormikArbeidsforholdArbeidslengde;
