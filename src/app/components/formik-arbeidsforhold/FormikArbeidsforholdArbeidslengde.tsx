import * as React from 'react';
import { useIntl } from 'react-intl';
import { FormikRadioPanelGroup, FormikTextarea } from '@navikt/sif-common-formik/lib';
import {
    createFieldValidationError,
    FieldValidationErrors,
    validateRequiredField,
} from 'common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';

import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    Utbetalingsårsak,
} from '../../types/ArbeidsforholdTypes';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { useFormikContext } from 'formik';
import { SøknadFormData } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
interface Props {
    arbeidsforholdFormData: ArbeidsforholdFormData;
    nameDokumenter: string;
    putPropsHere?: string;
    nameUtbetalingsårsak: string;
    nameKonfliktForklaring: string;
}

// TODO
const validateTekstField = (value: string): FieldValidationResult => {
    return value && typeof value === 'string' && value.length > 0 && value.length < 2000
        ? undefined
        : createFieldValidationError(FieldValidationErrors.påkrevd);
};

const FormikArbeidsforholdArbeidslengde: React.FC<Props> = ({
    arbeidsforholdFormData,
    nameDokumenter,
    nameUtbetalingsårsak,
    nameKonfliktForklaring,
}: Props) => {
    const intl = useIntl();

    const utbetalingsårsak: Utbetalingsårsak | undefined =
        arbeidsforholdFormData[ArbeidsforholdFormDataFields.utbetalingsårsak];

    const { values } = useFormikContext<SøknadFormData>();
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);

    return (
        <>
            <FormBlock margin="l">
                <FormikRadioPanelGroup
                    radios={[
                        {
                            label: intlHelper(intl, 'step.periode.grunn.nyoppstartetHosArbeidsgiver'),
                            value: Utbetalingsårsak.nyoppstartetHosArbeidsgiver,
                        },
                        {
                            label: intlHelper(intl, 'step.periode.grunn.arbeidsgiverKonkurs'),
                            value: Utbetalingsårsak.arbeidsgiverKonkurs,
                        },
                        {
                            label: intlHelper(intl, 'step.periode.grunn.konfliktMedArbeidsgiver'),
                            value: Utbetalingsårsak.konfliktMedArbeidsgiver,
                        },
                    ]}
                    legend={intlHelper(intl, 'step.periode.grunn.spm')}
                    name={nameUtbetalingsårsak}
                    useTwoColumns={false}
                    validate={validateRequiredField}
                />
            </FormBlock>
            {utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver && (
                <>
                    <FormBlock>
                        <FormikTextarea
                            name={nameKonfliktForklaring}
                            validate={validateTekstField}
                            maxLength={2000}
                            label={intlHelper(intl, 'step.periode.grunn.konfliktMedArbeidsgiver.folklaring')}
                        />
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
