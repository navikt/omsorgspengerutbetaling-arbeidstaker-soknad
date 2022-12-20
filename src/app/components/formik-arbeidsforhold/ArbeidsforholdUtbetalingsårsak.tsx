import React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { FormikRadioPanelGroup, FormikTextarea } from '@navikt/sif-common-formik/lib';
import FormikVedleggsKomponent from '../VedleggComponent/FormikVedleggsKomponent';
import { SøknadFormData } from '../../types/SøknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFormDataFields,
    Utbetalingsårsak,
    ÅrsakNyoppstartet,
} from '../../types/ArbeidsforholdTypes';
import {
    getStringValidator,
    getRequiredFieldValidator,
    ValidateStringError,
} from '@navikt/sif-common-formik/lib/validation';
import { AppFieldValidationErrors } from 'app/validation/fieldValidations';
import SøknadTempStorage from 'app/søknad/SoknadTempStorage';
import { StepID } from '../../søknad/soknadStepsConfig';
import { Person } from '../../types/Søkerdata';

interface Props {
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
    soknadId: string;
    søker: Person;
}

const ArbeidsforholdUtbetalingsårsak = ({ arbeidsforhold, parentFieldName, soknadId, søker }: Props) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormData>();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as ArbeidsforholdFormDataFields;

    const utbetalingsårsak: Utbetalingsårsak | undefined = arbeidsforhold.utbetalingsårsak;
    const arbeidsgivernavn = arbeidsforhold.navn;

    const attachments: Attachment[] = React.useMemo(() => {
        return arbeidsforhold ? arbeidsforhold.dokumenter : [];
    }, [arbeidsforhold]);

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const ref = React.useRef({ attachments });

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            setFieldValue(
                `arbeidsforhold.${parentFieldName}.${ArbeidsforholdFormDataFields.dokumenter}` as ArbeidsforholdFormDataFields,
                attachments
            );
            SøknadTempStorage.update(soknadId, values, StepID.SITUASJON, {
                søker,
            });
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, values, parentFieldName, soknadId, søker]);

    return (
        <>
            <FormBlock>
                <FormikRadioPanelGroup
                    radios={[
                        {
                            label: intlHelper(
                                intl,
                                'step.situasjon.arbeidsforhold.utbetalingsårsak.nyoppstartetHosArbeidsgiver'
                            ),
                            value: Utbetalingsårsak.nyoppstartetHosArbeidsgiver,
                        },
                        {
                            label: intlHelper(
                                intl,
                                'step.situasjon.arbeidsforhold.utbetalingsårsak.arbeidsgiverKonkurs'
                            ),
                            value: Utbetalingsårsak.arbeidsgiverKonkurs,
                        },
                        {
                            label: intlHelper(
                                intl,
                                'step.situasjon.arbeidsforhold.utbetalingsårsak.konfliktMedArbeidsgiver'
                            ),
                            value: Utbetalingsårsak.konfliktMedArbeidsgiver,
                        },
                    ]}
                    legend={intlHelper(intl, 'step.situasjon.arbeidsforhold.utbetalingsårsak.spm')}
                    name={getFieldName(ArbeidsforholdFormDataFields.utbetalingsårsak)}
                    useTwoColumns={false}
                    validate={(value) => {
                        return getRequiredFieldValidator()(value === Utbetalingsårsak.ikkeBesvart ? undefined : value)
                            ? {
                                  key: AppFieldValidationErrors.arbeidsforhold_utbetalings_årsak_no_Value,
                                  values: { arbeidsgivernavn },
                                  keepKeyUnaltered: true,
                              }
                            : undefined;
                    }}
                />
            </FormBlock>
            {utbetalingsårsak === Utbetalingsårsak.konfliktMedArbeidsgiver && (
                <>
                    <FormBlock>
                        <FormikTextarea
                            name={getFieldName(ArbeidsforholdFormDataFields.konfliktForklaring)}
                            validate={(value) => {
                                const error = getStringValidator({ minLength: 5, maxLength: 2000, required: true })(
                                    value
                                );
                                switch (error) {
                                    case ValidateStringError.stringHasNoValue:
                                        return {
                                            key: 'validation.arbeidsforhold.utbetalingsårsak.konfliktForklaring.stringHasNoValue',
                                            keepKeyUnaltered: true,
                                            values: { min: 5, maks: 2000 },
                                        };
                                    case ValidateStringError.stringIsTooShort:
                                        return {
                                            key: 'validation.arbeidsforhold.utbetalingsårsak.konfliktForklaring.stringIsTooShort',
                                            values: { min: 5, maks: 2000 },
                                            keepKeyUnaltered: true,
                                        };
                                    case ValidateStringError.stringIsTooLong:
                                        return {
                                            key: 'validation.arbeidsforhold.utbetalingsårsak.konfliktForklaring.stringIsTooLong',
                                            values: { min: 5, maks: 2000 },
                                            keepKeyUnaltered: true,
                                        };
                                }
                                return error;
                            }}
                            maxLength={2000}
                            label={intlHelper(
                                intl,
                                'step.situasjon.arbeidsforhold.utbetalingsårsak.konfliktMedArbeidsgiver.forklaring'
                            )}
                        />
                    </FormBlock>

                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'step.situasjon.arbeidsforhold.utbetalingsårsak.vedlegg')}
                        formikName={getFieldName(ArbeidsforholdFormDataFields.dokumenter)}
                        dokumenter={arbeidsforhold.dokumenter}
                        alleDokumenterISøknaden={alleDokumenterISøknaden}
                        title={intlHelper(intl, 'step.situasjon.arbeidsforhold.utbetalingsårsak.vedlegg.title')}
                    />
                    <Box margin={'l'}>
                        <PictureScanningGuide />
                    </Box>
                </>
            )}
            {utbetalingsårsak === Utbetalingsårsak.nyoppstartetHosArbeidsgiver && (
                <>
                    <FormBlock>
                        <FormikRadioPanelGroup
                            radios={[
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.jobbetHosAnnenArbeidsgiver'
                                    ),
                                    value: ÅrsakNyoppstartet.jobbetHosAnnenArbeidsgiver,
                                },
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.varFrilanser'
                                    ),
                                    value: ÅrsakNyoppstartet.varFrilanser,
                                },
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.varSelvstendige'
                                    ),
                                    value: ÅrsakNyoppstartet.varSelvstendige,
                                },
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.søkteAndreUtbetalinger'
                                    ),
                                    value: ÅrsakNyoppstartet.søkteAndreUtbetalinger,
                                },
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.arbeidIUtlandet'
                                    ),
                                    value: ÅrsakNyoppstartet.arbeidIUtlandet,
                                },
                                {
                                    label: intlHelper(
                                        intl,
                                        'step.situasjon.arbeidsforhold.årsakMinde4Uker.utøvdeVerneplikt'
                                    ),
                                    value: ÅrsakNyoppstartet.utøvdeVerneplikt,
                                },
                                {
                                    label: intlHelper(intl, 'step.situasjon.arbeidsforhold.årsakMinde4Uker.annet'),
                                    value: ÅrsakNyoppstartet.annet,
                                },
                            ]}
                            legend={intlHelper(intl, 'step.situasjon.arbeidsforhold.årsakMinde4Uker.spm')}
                            name={getFieldName(ArbeidsforholdFormDataFields.årsakNyoppstartet)}
                            useTwoColumns={false}
                            validate={(value) => {
                                return getRequiredFieldValidator()(value)
                                    ? {
                                          key: AppFieldValidationErrors.arbeidsforhold_årsak_mindre_4uker_no_Value,
                                          values: { arbeidsgivernavn },
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined;
                            }}
                        />
                    </FormBlock>
                </>
            )}
        </>
    );
};

export default ArbeidsforholdUtbetalingsårsak;
