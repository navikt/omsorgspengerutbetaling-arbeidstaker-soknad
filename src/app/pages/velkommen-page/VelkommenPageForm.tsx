import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import SoknadFormComponents from '../../søknad/SoknadFormComponents';
import { SøknadFormField } from '../../types/SøknadFormData';
import { Undertittel } from 'nav-frontend-typografi';
import InfoList from './components/info-list/InfoList';
import getLenker from '../../lenker';

interface Props {
    onStart: () => void;
}

const VelkommenPageForm = ({ onStart }: Props) => {
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            formErrorHandler={intlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <SoknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'page.velkommen.form.bekreftLabel')}
                    name={SøknadFormField.harForståttRettigheterOgPlikter}
                    validate={getCheckedValidator()}>
                    <Undertittel tag="h2">
                        <FormattedMessage id="page.velkommen.form.ansvar.tittel" />
                    </Undertittel>
                    <InfoList>
                        <li>
                            <FormattedMessage id="page.velkommen.form.ansvar.list.1" />
                        </li>
                        <li>
                            <FormattedMessage id="page.velkommen.form.ansvar.list.2.1" />{' '}
                            <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                                <FormattedMessage id="page.velkommen.form.ansvar.list.2.2" />
                            </Lenke>
                        </li>
                    </InfoList>
                </SoknadFormComponents.ConfirmationCheckbox>

                <Box textAlignCenter={true} margin="xl">
                    <FormBlock>
                        <div data-testid={'welcomingPage-begynnsøknad'}>
                            <Hovedknapp>{intlHelper(intl, 'welcomingPage.begynnsøknad')}</Hovedknapp>
                        </div>
                    </FormBlock>
                </Box>
            </FormBlock>
        </SoknadFormComponents.Form>
    );
};

export default VelkommenPageForm;
