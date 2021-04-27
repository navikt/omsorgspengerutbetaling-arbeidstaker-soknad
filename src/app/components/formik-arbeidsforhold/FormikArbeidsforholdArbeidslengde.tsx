import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormikRadioPanelGroup, FormikTextarea, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import {
    getStringValidator,
    ValidateRequiredFieldError,
    ValidateStringError,
} from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import getLenker from '../../lenker';
import {
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
} from '../../types/AnsettelseslengdeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormData } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';

export const validateHvorLengeJobbetQuestion = (value: HvorLengeJobbet): ValidationResult<ValidationError> => {
    return value === undefined || value === HvorLengeJobbet.IKKE_BESVART
        ? ValidateRequiredFieldError.noValue
        : undefined;
};

const validateHvorLengeJobbetBegrunnelseRadioGroup = (
    value: HvorLengeJobbetFordi
): ValidationResult<ValidationError> => {
    return value === undefined || value === HvorLengeJobbetFordi.IKKE_BESVART
        ? ValidateRequiredFieldError.noValue
        : undefined;
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

const FormComponent = getTypedFormComponents<string, string, ValidationError>();

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
    const arbeidsgivernavn = arbeidsforholdFormData.navn || arbeidsforholdFormData.organisasjonsnummer;

    return (
        <>
            <FormBlock margin="none">
                <FormComponent.RadioPanelGroup
                    radios={[
                        {
                            label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                            value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
                        },
                        {
                            label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                            value: HvorLengeJobbet.MER_ENN_FIRE_UKER,
                        },
                    ]}
                    useTwoColumns={true}
                    name={nameHvorLengeJobbet}
                    legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                    validate={(value) =>
                        validateHvorLengeJobbetQuestion(value)
                            ? { key: 'validation.arbeidsforhold.hvorLengeJobbet.noValue', values: { arbeidsgivernavn } }
                            : undefined
                    }
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
                                <p>{intlHelper(intl, 'hvorLengeJobbet.fordi.legend-header')}</p>
                                <div className={'normal-tekst'}>
                                    <FormattedMessage id="hvorLengeJobbet.fordi.legend-text" />
                                </div>
                            </div>
                        }
                        name={nameBegrunnelse}
                        useTwoColumns={false}
                        validate={(value) =>
                            validateHvorLengeJobbetBegrunnelseRadioGroup(value)
                                ? {
                                      key: 'validation.arbeidsforhold.ansettelseslengde.begrunnelse.noValue',
                                      values: { arbeidsgivernavn },
                                  }
                                : undefined
                        }
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && fordi === HvorLengeJobbetFordi.INGEN && (
                <FormBlock>
                    <FormattedMessage id={'arbeidsforhold.hvorLengeJobbet.ingen.helpertext'} />
                    {/* TODO: Dette skaper latency issues :/ */}
                    <Box margin="l">
                        <FormikTextarea
                            name={nameForklaring}
                            validate={(value) => {
                                const error = getStringValidator({ minLength: 5, maxLength: 2000, required: true })(
                                    value
                                );
                                switch (error) {
                                    case ValidateRequiredFieldError.noValue:
                                        return {
                                            key:
                                                'validation.arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring.noValue',
                                        };
                                    case ValidateStringError.stringIsTooShort:
                                        return {
                                            key:
                                                'validation.arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring.stringIsTooShort',
                                            values: { lengde: 5 },
                                        };
                                    case ValidateStringError.stringIsTooLong:
                                        return {
                                            key:
                                                'validation.arbeidsforhold.ansettelseslengde.ingenAvSituasjoneneForklaring.stringIsTooLong',
                                            values: { lengde: 2000 },
                                        };
                                }
                                return error;
                            }}
                            maxLength={2000}
                        />
                    </Box>
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                <>
                    <FormBlock>
                        <CounsellorPanel>
                            <Box padBottom={'l'}>
                                <FormattedMessage id="arbeidslengde.merEnnFireUker.info.1" />
                            </Box>
                            <Box padBottom={'l'}>
                                <FormattedMessage id="arbeidslengde.merEnnFireUker.info.2" />{' '}
                                <Lenke href={getLenker(intl.locale).veiledningEttersendelse} target="_blank">
                                    <FormattedMessage id="arbeidslengde.merEnnFireUker.info.3" />
                                </Lenke>
                                <FormattedMessage id="arbeidslengde.merEnnFireUker.info.4" />
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
