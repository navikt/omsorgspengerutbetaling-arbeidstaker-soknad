import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../config/stepConfig';
import { HvorLengeJobbet, HvorLengeJobbetFordi, SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadStep from '../SøknadStep';
import { FormikRadioPanelGroup, LabelWithInfo } from '@navikt/sif-common-formik/lib';
import { PopoverOrientering } from 'nav-frontend-popover';
import FormBlock from 'common/components/form-block/FormBlock';
import { useFormikContext } from 'formik';
import { FieldValidationResult } from 'common/validation/types';
import FormikQuestion from '../../components/formik-question/FormikQuestion';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import { navigateToLoginPage } from '../../utils/navigationUtils';
import { validateDocuments } from '../../validation/fieldValidations';
import Box from 'common/components/box/Box';
import FileUploadErrors from '../../components/file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import PictureScanningGuide from '../../components/picture-scanning-guide/PictureScanningGuide';

const validateFormikQuestion = (value: HvorLengeJobbet): FieldValidationResult => {
    return value === HvorLengeJobbet.IKKE_BESVART
        ? {
              key: 'fieldvalidation.påkrevd'
          }
        : undefined;
};

const validateRadiogroup = (value: HvorLengeJobbetFordi): FieldValidationResult => {
    return value === HvorLengeJobbetFordi.IKKE_BESVART
        ? {
              key: 'fieldvalidation.påkrevd'
          }
        : undefined;
};

const BegrunnelseStepView = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();

    const hvorLengeJobbet: HvorLengeJobbet = values[SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver];
    const fordi: HvorLengeJobbetFordi = values[SøknadFormField.hvorLengeJobbetFordi];

    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (values.dokumenter || []).find((a: any) => a.pending === true) !== undefined;

    return (
        <SøknadStep
            id={StepID.BEGRUNNELSE}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={true}
            buttonDisabled={hasPendingUploads}>
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
                    name={SøknadFormField.hvorLengeHarDuJobbetHosNåværendeArbeidsgiver}
                    legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                    validate={validateFormikQuestion}
                />
            </FormBlock>

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
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
                        name={SøknadFormField.hvorLengeJobbetFordi}
                        useTwoColumns={false}
                        validate={validateRadiogroup}
                    />
                </FormBlock>
            )}

            {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && fordi === HvorLengeJobbetFordi.INGEN && (
                <FormBlock>
                    <AlertStripeFeil>
                        For at du som arbeidstaker skal ha rett til utbetaling av omsorgspenger fra NAV, må det være én
                        av situasjonene over som gjelder.
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
                        <FormikFileUploader
                            name={SøknadFormField.dokumenter}
                            label={intlHelper(intl, 'steg.dokumenter.vedlegg')}
                            onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                            onFileInputClick={() => {
                                setFilesThatDidntGetUploaded([]);
                            }}
                            onUnauthorizedOrForbiddenUpload={() => navigateToLoginPage()}
                            validate={validateDocuments}
                        />
                    </FormBlock>
                    <Box margin="m">
                        <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                    </Box>
                    <Box margin="l">
                        <UploadedDocumentsList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
                    </Box>
                </div>
            )}
        </SøknadStep>
    );
};

export default BegrunnelseStepView;
