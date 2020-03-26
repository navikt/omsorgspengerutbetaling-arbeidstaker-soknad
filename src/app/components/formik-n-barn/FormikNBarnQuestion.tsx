import * as React from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import { NBarn } from './n-barn-types';
import { FormikRadioPanelGroupProps } from '@navikt/sif-common-formik/lib/components/formik-radio-panel-group/FormikRadioPanelGroup';
import { FormikRadioPanelGroup, LabelWithInfo, TypedFormInputCommonProps } from '@navikt/sif-common-formik/lib';
import { FieldValidationResult } from 'common/validation/types';

export const validateNBarnIsAnswered = (answer: NBarn): FieldValidationResult => {
    return answer === NBarn.UNANSWERED
        ? {
              key: 'fieldvalidation.nBarn'
          }
        : undefined;
};

export interface FormikNBarnQuestionProps<FieldName> extends Omit<FormikRadioPanelGroupProps<FieldName>, 'radios'> {
    infoPlassering?: PopoverOrientering;
    labels?: {
        [NBarn.ONE]?: string;
        [NBarn.TWO]?: string;
        [NBarn.THREE_OR_MORE]?: string;
        [NBarn.UNANSWERED]?: string;
    };
}

function FormikNBarnQuestion<FieldName>({
    legend,
    name,
    labels,
    infoPlassering,
    info,
    ...restProps
}: FormikNBarnQuestionProps<FieldName> & TypedFormInputCommonProps) {
    const {
        [NBarn.ONE]: one = '1 barn',
        [NBarn.TWO]: two = '2 barn',
        [NBarn.THREE_OR_MORE]: threeOrMore = '3 eller flere barn'
    } = labels || {};
    return (
        <FormikRadioPanelGroup<FieldName>
            radios={[
                { label: one, value: NBarn.ONE },
                { label: two, value: NBarn.TWO },
                { label: threeOrMore, value: NBarn.THREE_OR_MORE }
            ]}
            {...restProps}
            legend={
                <LabelWithInfo infoPlassering={infoPlassering} info={info}>
                    {legend}
                </LabelWithInfo>
            }
            name={name}
            useTwoColumns={false}
        />
    );
}

export default FormikNBarnQuestion;
