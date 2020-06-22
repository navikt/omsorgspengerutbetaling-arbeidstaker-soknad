import * as React from 'react';
import FormSection from 'common/components/form-section/FormSection';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FormBlock from 'common/components/form-block/FormBlock';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdArbeidslengde from './FormikArbeidsforholdArbeidslengde';
import FormikArbeidsforholdPeriodeView from './FormikArbeidsforholdPeriode';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { AnsettelseslengdeFormDataFields } from '../../types/AnsettelseslengdeTypes';

interface Props {
    annetArbeidsforhold: ArbeidsforholdFormData;
    annetArbeidsforholdName: string;
}

const FormikAnnetArbeidsforholdStegTo: React.FC<Props> = ({ annetArbeidsforhold, annetArbeidsforholdName }) => {
    const getFieldNameAnnetArbeidsforhold = (arbeidsforholdFieldName: ArbeidsforholdFormDataFields): string =>
        `${SøknadFormField.annetArbeidsforhold}.${arbeidsforholdFieldName}`;

    const getFieldNameArbeidslengde = (fieldnameAnsettelseslengde: AnsettelseslengdeFormDataFields): string =>
        `${getFieldNameAnnetArbeidsforhold(
            ArbeidsforholdFormDataFields.ansettelseslengde
        )}.${fieldnameAnsettelseslengde}`;

    const nameHvorLengeJobbet = getFieldNameArbeidslengde(AnsettelseslengdeFormDataFields.hvorLengeJobbet);
    const nameBegrunnelse = getFieldNameArbeidslengde(AnsettelseslengdeFormDataFields.begrunnelse);
    const nameForklaring = getFieldNameArbeidslengde(AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring);
    const nameDokumenter = getFieldNameAnnetArbeidsforhold(ArbeidsforholdFormDataFields.dokumenter);

    const nameHarPerioderMedFravær = getFieldNameAnnetArbeidsforhold(ArbeidsforholdFormDataFields.harPerioderMedFravær);
    const namePerioderMedFravær = getFieldNameAnnetArbeidsforhold(ArbeidsforholdFormDataFields.fraværPerioder);
    const nameHarDagerMedDelvisFravær = getFieldNameAnnetArbeidsforhold(
        ArbeidsforholdFormDataFields.harDagerMedDelvisFravær
    );
    const nameDagerMedDelvisFravær = getFieldNameAnnetArbeidsforhold(ArbeidsforholdFormDataFields.fraværDager);

    return (
        <FormBlock paddingBottom={'xl'}>
            <FormSection titleTag="h4" title={annetArbeidsforholdName} titleIcon={<BuildingIcon />}>
                <FormikArbeidsforholdArbeidslengde
                    arbeidsforholdFormData={annetArbeidsforhold}
                    nameHvorLengeJobbet={nameHvorLengeJobbet}
                    nameBegrunnelse={nameBegrunnelse}
                    nameForklaring={nameForklaring}
                    nameDokumenter={nameDokumenter}
                />
                <FormikArbeidsforholdPeriodeView
                    arbeidsforholdFormData={annetArbeidsforhold}
                    nameHarPerioderMedFravær={nameHarPerioderMedFravær}
                    namePerioderMedFravær={namePerioderMedFravær}
                    nameHarDagerMedDelvisFravær={nameHarDagerMedDelvisFravær}
                    nameDagerMedDelvisFravær={nameDagerMedDelvisFravær}
                />
            </FormSection>
        </FormBlock>
    );
};

export default FormikAnnetArbeidsforholdStegTo;
