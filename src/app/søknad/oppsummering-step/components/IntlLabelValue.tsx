import React from 'react';
import { useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    labelKey: string;
    children: React.ReactNode;
}

const bem = bemUtils('summaryLabelValue');

const IntlLabelValue = ({ labelKey, children }: Props) => {
    const intl = useIntl();
    return (
        <div className={bem.block}>
            <span className={bem.element('label')}>{intlHelper(intl, labelKey)}:</span>{' '}
            <span className={bem.element('value')}>{children}</span>
        </div>
    );
};

export default IntlLabelValue;
