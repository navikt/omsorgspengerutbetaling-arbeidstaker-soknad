import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormBlock from 'common/components/form-block/FormBlock';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';

interface Props {
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
    openBehandlingAvPersonopplysningerModal: () => void;
}

const AppForm = getTypedFormComponents<SøknadFormField, SøknadFormData>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm: React.FC<Props> = ({
    onConfirm,
    onOpenDinePlikterModal,
    openBehandlingAvPersonopplysningerModal,
}: Props): JSX.Element => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={intlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={SøknadFormField.harForståttRettigheterOgPlikter}
                    validate={getCheckedValidator()}>
                    <FormattedMessage
                        id="welcomingPage.samtykke.harForståttLabel"
                        values={{
                            plikterLink: (
                                <Lenke href="#" onClick={onOpenDinePlikterModal}>
                                    {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                </Lenke>
                            ),
                        }}
                    />
                </AppForm.ConfirmationCheckbox>
            </FormBlock>
            <FormBlock>
                <Hovedknapp className={bem.element('startApplicationButton')}>
                    {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                </Hovedknapp>
            </FormBlock>
            <FormBlock>
                <div className={bem.element('personopplysningModalLenke')}>
                    <Lenke href="#" onClick={openBehandlingAvPersonopplysningerModal}>
                        <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                    </Lenke>
                </div>
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
