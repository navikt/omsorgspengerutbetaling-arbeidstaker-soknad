import * as React from 'react';
import FormBlock from 'common/components/form-block/FormBlock';
import FormikQuestion from '../formik-question/FormikQuestion';
import intlHelper from 'common/utils/intlUtils';
import { FormikRadioPanelGroup, FormikTextarea, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import { PopoverOrientering } from 'nav-frontend-popover';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import Box from 'common/components/box/Box';
import FileUploadErrors from '../file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { FieldValidationResult } from 'common/validation/types';
import { createFieldValidationError, FieldValidationErrors } from 'common/validation/fieldValidations';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import {
    AnsettelseslengdeFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi
} from '../../types/AnsettelseslengdeTypes';
import EkspanderbarPSG from '../EkspanderbarPSG/EkspanderbarPSG';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';

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

export const getRadioTextIdHvorLengeJobbetFordi = (hvorLengeJobbetFordi: HvorLengeJobbetFordi) => {
    switch (hvorLengeJobbetFordi) {
        case HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD: {
            return 'hvorLengeJobbet.fordi.annetArbeidsforhold.label';
        }
        case HvorLengeJobbetFordi.ANDRE_YTELSER: {
            return 'hvorLengeJobbet.fordi.andreYtelser.label';
        }
        case HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON: {
            return 'hvorLengeJobbet.fordi.lovbestemtFerie.label';
        }
        case HvorLengeJobbetFordi.MILITÆRTJENESTE: {
            return 'hvorLengeJobbet.fordi.militærtjeneste.label';
        }
        case HvorLengeJobbetFordi.INGEN: {
            return 'hvorLengeJobbet.fordi.ingen.label';
        }
        case HvorLengeJobbetFordi.IKKE_BESVART: {
            return 'hvorLengeJobbet.fordi.ikkeBesvart.label';
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
    nameDokumenter
}) => {
    const intl = useIntl();

    const hvorLengeJobbet: HvorLengeJobbet =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.hvorLengeJobbet
        ];
    const fordi: HvorLengeJobbetFordi =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.begrunnelse
        ];

    return (
        <>
            <FormBlock margin={'xxl'}>
                <FormikQuestion
                    firstAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                        value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
                    }}
                    secondAlternative={{
                        label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                        value: HvorLengeJobbet.MER_ENN_FIRE_UKER
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
                                value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.ANDRE_YTELSER)
                                ),
                                value: HvorLengeJobbetFordi.ANDRE_YTELSER
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(
                                        HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                                    )
                                ),
                                value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.MILITÆRTJENESTE)
                                ),
                                value: HvorLengeJobbetFordi.MILITÆRTJENESTE
                            },
                            {
                                label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.INGEN)),
                                value: HvorLengeJobbetFordi.INGEN
                            }
                        ]}
                        legend={
                            <div>
                                <p>
                                    <LabelWithInfo infoPlassering={PopoverOrientering.Over}>
                                        {intlHelper(intl, 'hvorLengeJobbet.fordi.legend-header')}
                                    </LabelWithInfo>
                                </p>
                                <div className={'normal-tekst'}>
                                    <FormattedHTMLMessage id="hvorLengeJobbet.fordi.legend-text" />
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
                    <FormattedHTMLMessage id={'arbeidsforhold.hvorLengeJobbet.ingen.helpertext'} />
                    {/* TODO: Dette skaper latency issues :/ */}
                    <FormikTextarea
                        name={nameForklaring}
                        validate={validateIngenAvSituasjoneneTekstField}
                        maxLength={2000}
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                <div>
                    <FormBlock>
                        <CounsellorPanel>
                            <Box padBottom={'l'}>
                                Vanligvis skal arbeidsgiver utbetale omsorgspenger når du har jobbet hos dem i mer enn 4
                                uker. Hvis arbeidsgiver ikke utbetaler{' '}
                                <strong>må du laste opp en forklaring fra arbeidsgiver</strong> på hvorfor de ikke
                                utbetaler omsorgspenger til deg.
                            </Box>
                            <Box padBottom={'l'}>
                                Hvis du ikke har forklaringen tilgjengelig nå, må du ettersende den til oss så snart du
                                har den. Vi kan ikke behandle søknaden før vi har mottatt bekreftelsen.
                            </Box>
                            <Box padBottom={'l'}>Du må også be arbeidsgiveren din sende inntektsmelding til NAV.</Box>
                        </CounsellorPanel>
                    </FormBlock>
                    <EkspanderbarPSG />
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                        formikName={nameDokumenter}
                        dokumenter={arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter]}
                    />
                </div>
            )}
        </>
    );
};

export default FormikArbeidsforholdArbeidslengde;
