import * as React from 'react';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FormBlock from 'common/components/form-block/FormBlock';
import FormSection from 'common/components/form-section/FormSection';
import { AnsettelseslengdeFormDataFields } from '../../types/AnsettelseslengdeTypes';
import { ArbeidsforholdFormData, ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
import { SøknadFormField } from '../../types/SøknadFormData';
import FormikArbeidsforholdArbeidslengde from './FormikArbeidsforholdArbeidslengde';
import FormikArbeidsforholdPeriodeView from './FormikArbeidsforholdPeriode';

interface Props {
    annetArbeidsforhold: ArbeidsforholdFormData;
    annetArbeidsforholdName: string;
    minDateForFravær: Date;
    maxDateForFravær: Date;
    årstall?: number;
}

const FormikAnnetArbeidsforholdStegTo: React.FC<Props> = ({
    annetArbeidsforhold,
    annetArbeidsforholdName,
    minDateForFravær,
    maxDateForFravær,
    årstall,
}) => {
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
        <div className="arbeidsforhold-liste">
            <FormBlock>
                <FormSection titleTag="h2" title={annetArbeidsforholdName} titleIcon={<BuildingIcon />}>
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
                        minDateForFravær={minDateForFravær}
                        maxDateForFravær={maxDateForFravær}
                        årstall={årstall}
                    />
                </FormSection>
            </FormBlock>
        </div>
    );
};

export default FormikAnnetArbeidsforholdStegTo;
