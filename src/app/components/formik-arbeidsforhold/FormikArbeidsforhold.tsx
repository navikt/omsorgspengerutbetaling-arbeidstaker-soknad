import React from 'react';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredField } from 'common/validation/fieldValidations';

import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';
import {
    Arbeidsforhold,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeSvar,
    SøknadFormField
} from '../../types/SøknadFormData';
import { FormikInput, FormikRadioPanelGroup, FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforhold: React.FunctionComponent<Props> = ({ arbeidsforhold, index }) => {
    const intl = useIntl();
    return (
        <FieldArray name={SøknadFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as SøknadFormField;
                return (
                    <>
                        <FormikYesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <Box padBottom="m">
                                <FormikRadioPanelGroup<SøknadFormField>
                                    legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                                    useTwoColumns={false}
                                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                                    validate={validateRequiredField}
                                    radios={[
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                            value: ArbeidsforholdSkalJobbeSvar.nei,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                            value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                            value: ArbeidsforholdSkalJobbeSvar.ja,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.redusert'),
                                            value: ArbeidsforholdSkalJobbeSvar.redusert,
                                        }
                                    ]}
                                />
                                {arbeidsforhold.skalJobbe && (
                                    <>
                                        <Box margin="xl">
                                            <SkjemaGruppe
                                                legend={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                                                    arbeidsforhold: arbeidsforhold.navn
                                                })}>
                                                <FormikInput<SøknadFormField>
                                                    name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                    type="number"
                                                    label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                                                    inputClassName="input--timer"
                                                    validate={(value) => validateReduserteArbeidProsent(value, true)}
                                                    value={arbeidsforhold.jobberNormaltTimer || ''}
                                                    // labelRight={true}
                                                    min={0}
                                                    max={100}
                                                    maxLength={2}
                                                />
                                            </SkjemaGruppe>
                                        </Box>
                                    </>
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <RedusertArbeidsforholdPart
                                        arbeidsforhold={arbeidsforhold}
                                        getFieldName={getFieldName}
                                    />
                                )}
                            </Box>
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
