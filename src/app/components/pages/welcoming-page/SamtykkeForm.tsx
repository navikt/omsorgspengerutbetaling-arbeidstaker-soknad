import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormBlock from 'common/components/form-block/FormBlock';
import bemHelper from 'common/utils/bemUtils';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import intlHelper from 'common/utils/intlUtils';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';

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
            fieldErrorRenderer={(error): React.ReactNode => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={SøknadFormField.harForståttRettigheterOgPlikter}
                    validate={(value): string | undefined =>
                        value !== true ? intlHelper(intl, 'welcomingPage.samtykke.harIkkeGodkjentVilkår') : undefined
                    }>
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
