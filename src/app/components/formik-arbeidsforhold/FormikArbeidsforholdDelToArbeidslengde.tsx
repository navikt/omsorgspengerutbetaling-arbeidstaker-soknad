import React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import intlHelper from 'common/utils/intlUtils';
import {
    AnsettelseslengdeFormDataFields,
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    HvorLengeJobbet,
    HvorLengeJobbetFordi,
    SøknadFormField
} from '../../types/SøknadFormData';
import { FormikRadioPanelGroup, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import FormBlock from 'common/components/form-block/FormBlock';
import Box from 'common/components/box/Box';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import FormikQuestion from '../formik-question/FormikQuestion';
import { PopoverOrientering } from 'nav-frontend-popover';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import PictureScanningGuide from '../picture-scanning-guide/PictureScanningGuide';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import FileUploadErrors from '../file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import { FieldValidationResult } from 'common/validation/types';

const validateHvorLengeJobbetQuestion = (value: HvorLengeJobbet): FieldValidationResult => {
    return value === HvorLengeJobbet.IKKE_BESVART
        ? {
              key: 'fieldvalidation.påkrevd'
          }
        : undefined;
};

const validateHvorLengeJobbetBegrunnelseRadioGroup = (value: HvorLengeJobbetFordi): FieldValidationResult => {
    return value === HvorLengeJobbetFordi.IKKE_BESVART
        ? {
              key: 'fieldvalidation.påkrevd'
          }
        : undefined;
};

interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    index: number;
}

const FormikArbeidsforholdDelToArbeidslengde: React.FunctionComponent<Props> = ({ arbeidsforholdFormData, index }) => {
    const intl = useIntl();

    const hvorLengeJobbet: HvorLengeJobbet =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.hvorLengeJobbet
        ];
    const fordi: HvorLengeJobbetFordi =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.begrunnelse
        ];

    // TODO: Add text field
    const ingenAvSituasjoneneForklaring: string | null =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
            AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring
        ];

    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);

    // TODO: Disable Fortsett button if fileupload is pending
    const hasPendingUploads: boolean =
        (arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter] || []).find((a: any) => a.pending === true) !==
        undefined;

    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getArbeidsforholdFormDataFieldName = (field: ArbeidsforholdFormDataFields) =>
                    `${name}.${index}.${field}`;
                const getAnsettelseslengdeFormDataFieldName = (field: AnsettelseslengdeFormDataFields) =>
                    `${getArbeidsforholdFormDataFieldName(
                        ArbeidsforholdFormDataFields.ansettelseslengde
                    )}.${field}`;
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
                                name={getAnsettelseslengdeFormDataFieldName(
                                    AnsettelseslengdeFormDataFields.hvorLengeJobbet
                                )}
                                legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                                validate={validateHvorLengeJobbetQuestion}
                            />
                        </FormBlock>

                        {arbeidsforholdFormData[ArbeidsforholdFormDataFields.ansettelseslengde][
                            AnsettelseslengdeFormDataFields.hvorLengeJobbet
                        ] === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
                            <FormBlock>
                                <FormikRadioPanelGroup
                                    radios={[
                                        {
                                            label: intlHelper(intl, 'hvorLengeJobbet.fordi.annetArbeidsforhold.label'),
                                            value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD
                                        },
                                        {
                                            label: intlHelper(intl, 'hvorLengeJobbet.fordi.andreYtelser.label'),
                                            value: HvorLengeJobbetFordi.ANDRE_YTELSER
                                        },
                                        {
                                            label: intlHelper(intl, 'hvorLengeJobbet.fordi.militærtjeneste.label'),
                                            value: HvorLengeJobbetFordi.MILITÆRTJENESTE
                                        },
                                        {
                                            label: intlHelper(intl, 'hvorLengeJobbet.fordi.lovbestemtFerie.label'),
                                            value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                                        },
                                        {
                                            label: intlHelper(intl, 'hvorLengeJobbet.fordi.ingen.label'),
                                            value: HvorLengeJobbetFordi.INGEN
                                        }
                                    ]}
                                    legend={
                                        <LabelWithInfo
                                            infoPlassering={PopoverOrientering.Over}
                                            // info={"Hva slags info er dette ?"}
                                        >
                                            {intlHelper(intl, 'hvorLengeJobbet.fordi.legend')}
                                        </LabelWithInfo>
                                    }
                                    name={getAnsettelseslengdeFormDataFieldName(
                                        AnsettelseslengdeFormDataFields.begrunnelse
                                    )}
                                    useTwoColumns={false}
                                    validate={validateHvorLengeJobbetBegrunnelseRadioGroup}
                                />
                            </FormBlock>
                        )}

                        {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
                            fordi === HvorLengeJobbetFordi.INGEN && (
                                <FormBlock>
                                    <AlertStripeFeil>
                                        For at du som arbeidstaker skal ha rett til utbetaling av omsorgspenger fra NAV,
                                        må det være én av situasjonene over som gjelder.
                                    </AlertStripeFeil>
                                </FormBlock>
                            )}

                        {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                            <FormBlock>
                                <CounsellorPanel>
                                    <FormattedHTMLMessage id={'hvorLengeJobbet.merEnnFire.counsellor.html'} />
                                </CounsellorPanel>
                            </FormBlock>
                        )}

                        {hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER && (
                            <div>
                                <FormBlock>
                                    <HelperTextPanel>
                                        <PictureScanningGuide />
                                    </HelperTextPanel>
                                </FormBlock>
                                <FormBlock>
                                    {/* TODO: Fix nullpointer: Cannot read property 'split' of undefined*/}
                                    <FormikFileUploader
                                        name={getArbeidsforholdFormDataFieldName(
                                            ArbeidsforholdFormDataFields.dokumenter
                                        )}
                                        label={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                                        onFileInputClick={() => {
                                            setFilesThatDidntGetUploaded([]);
                                        }}
                                        onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
                                        validate={validateDocuments}
                                        listOfAttachments={
                                            arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter]
                                        }
                                    />
                                </FormBlock>
                                <Box margin="m">
                                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                                </Box>
                                <Box margin="l">
                                    <UploadedDocumentsList
                                        attachments={arbeidsforholdFormData[ArbeidsforholdFormDataFields.dokumenter]}
                                        formikFieldName={getArbeidsforholdFormDataFieldName(ArbeidsforholdFormDataFields.dokumenter)}
                                        wrapNoAttachmentsInBox={true}
                                        includeDeletionFunctionality={true}
                                    />
                                </Box>
                            </div>
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforholdDelToArbeidslengde;
