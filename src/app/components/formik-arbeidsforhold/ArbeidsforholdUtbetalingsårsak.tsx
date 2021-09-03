import React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FormikRadioPanelGroup, FormikTextarea } from '@navikt/sif-common-formik/lib';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';
import { SøknadFormData } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    Utbetalingsårsak,
} from '../../types/ArbeidsforholdTypes';
import {
    createFieldValidationError,
    FieldValidationErrors,
    validateRequiredField,
} from 'common/validation/fieldValidations';

interface Props {
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
}

// TODO
const validateTekstField = (value: string): FieldValidationResult => {
    return value && typeof value === 'string' && value.length > 0 && value.length < 2000
        ? undefined
        : createFieldValidationError(FieldValidationErrors.påkrevd);
};

const ArbeidsforholdUtbetalingsårsak = ({ arbeidsforhold, parentFieldName }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;

    const utbetalingsårsak: Utbetalingsårsak | undefined = arbeidsforhold.utbetalingsårsak;
    const { values } = useFormikContext<SøknadFormData>();
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    return (
        <>
            <FormBlock>
                <FormikRadioPanelGroup
                    radios={[
                        {
                            label: intlHelper(intl, 'step.periode.utbetalingsårsak.nyoppstartetHosArbeidsgiver'),
                            value: Utbetalingsårsak.nyoppstartetHosArbeidsgiver,
                        },
                        {
                            label: intlHelper(intl, 'step.periode.utbetalingsårsak.arbeidsgiverKonkurs'),
                            value: Utbetalingsårsak.arbeidsgiverKonkurs,
                        },
                        {
                            label: intlHelper(intl, 'step.periode.utbetalingsårsak.konfliktMedArbeidsgiver'),
                            value: Utbetalingsårsak.konfliktMedArbeidsgiver,
                        },
                    ]}
                    legend={intlHelper(intl, 'step.periode.utbetalingsårsak.spm')}
                    name={getFieldName(ArbeidsforholdFormDataFields.utbetalingsårsak)}
                    useTwoColumns={false}
                    validate={validateRequiredField}
                />
            </FormBlock>
            {utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver && (
                <>
                    <FormBlock>
                        <FormikTextarea
                            name={getFieldName(ArbeidsforholdFormDataFields.konfliktForklaring)}
                            validate={validateTekstField}
                            maxLength={2000}
                            label={intlHelper(intl, 'step.periode.utbetalingsårsak.konfliktMedArbeidsgiver.forklaring')}
                        />
                    </FormBlock>
                    <Box margin={'l'}>
                        <PictureScanningGuide />
                    </Box>
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'step.periode.utbetalingsårsak.vedlegg')}
                        formikName={getFieldName(ArbeidsforholdFormDataFields.dokumenter)}
                        dokumenter={arbeidsforhold.dokumenter}
                        alleDokumenterISøknaden={alleDokumenterISøknaden}
                    />
                </>
            )}
        </>
    );
};

export default ArbeidsforholdUtbetalingsårsak;
