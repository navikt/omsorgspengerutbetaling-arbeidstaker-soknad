import * as React from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import { FormikRadioPanelGroupProps } from '@navikt/sif-common-formik/lib/components/formik-radio-panel-group/FormikRadioPanelGroup';
import { FormikRadioPanelGroup, LabelWithInfo, TypedFormInputCommonProps } from '@navikt/sif-common-formik/lib';

export interface Answer {
    label: string;
    value: string;
}

export interface FormikQuestionProps<FieldName> extends Omit<FormikRadioPanelGroupProps<FieldName>, 'radios'> {
    firstAlternative: Answer;
    secondAlternative: Answer;
    useTwoColumns: boolean;
    infoPlassering?: PopoverOrientering;
}

function FormikQuestion<FieldName>(props: FormikQuestionProps<FieldName> & TypedFormInputCommonProps) {
    const { firstAlternative, secondAlternative, legend, useTwoColumns, infoPlassering, name, ...restProps } = props;

    return (
        <FormikRadioPanelGroup<FieldName>
            radios={[
                {
                    label: firstAlternative.label,
                    value: firstAlternative.value,
                },
                {
                    label: secondAlternative.label,
                    value: secondAlternative.value,
                },
            ]}
            {...restProps}
            legend={<LabelWithInfo infoPlassering={infoPlassering}>{legend}</LabelWithInfo>}
            name={name}
            useTwoColumns={useTwoColumns}
            validate={props.validate}
        />
    );
}

export default FormikQuestion;
