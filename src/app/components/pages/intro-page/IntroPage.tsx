import * as React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import {
    FormikRadioPanelGroup,
    getTypedFormComponents,
    LabelWithInfo,
    UnansweredQuestionsInfo,
    YesOrNo,
} from '@navikt/sif-common-formik/lib';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { PopoverOrientering } from 'nav-frontend-popover';
import { RadioPanelProps } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import ExpandableInfo from 'common/components/expandable-content/ExpandableInfo';
import FormBlock from 'common/components/form-block/FormBlock';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Knappelenke from 'common/components/knappelenke/Knappelenke';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import intlHelper from 'common/utils/intlUtils';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';
import { HvorLengeJobbet, HvorLengeJobbetFordi } from '../../../types/AnsettelseslengdeTypes';
import { getRadioTextIdHvorLengeJobbetFordi } from '../../formik-arbeidsforhold/FormikArbeidsforholdArbeidslengde';
import FormikQuestion from '../../formik-question/FormikQuestion';
import SmittevernInfo from '../../information/SmittevernInfo';
import './introPage.less';

const bem = bemUtils('introPage');

enum PageFormField {
    hvorLengeJobbet = 'hvorLengeJobbet',
    begrunnelse = 'begrunnelse',
    hjemmePgaStengt = 'hjemmePgaStengt',
    smittevernHensyn = 'smittevernHensyn',
}

interface PageFormValues {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet;
    [PageFormField.hjemmePgaStengt]: YesOrNo;
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi;
    [PageFormField.smittevernHensyn]: YesOrNo;
}

const initialValues: PageFormValues = {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
    [PageFormField.hjemmePgaStengt]: YesOrNo.UNANSWERED,
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED,
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const getHvorLengeRadios = (intl: IntlShape): RadioPanelProps[] => [
    {
        label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD)),
        value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD,
    },
    {
        label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.ANDRE_YTELSER)),
        value: HvorLengeJobbetFordi.ANDRE_YTELSER,
    },
    {
        label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.MILITÆRTJENESTE)),
        value: HvorLengeJobbetFordi.MILITÆRTJENESTE,
    },
    {
        label: intlHelper(
            intl,
            getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON)
        ),
        value: HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON,
    },
    {
        label: intlHelper(intl, getRadioTextIdHvorLengeJobbetFordi(HvorLengeJobbetFordi.INGEN)),
        value: HvorLengeJobbetFordi.INGEN,
    },
];

const IntroPage: React.FC = (): JSX.Element => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={(): JSX.Element => (
                <StepBanner tag="h1" text={intlHelper(intl, 'introPage.stegTittel')} />
            )}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        <FormattedMessage id="introPage.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="introPage.info.2" />
                    </p>
                </InformationPoster>
            </Box>

            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={(): null => null}
                    initialValues={initialValues}
                    renderForm={({
                        values: { hvorLengeJobbet, begrunnelse, smittevernHensyn, hjemmePgaStengt },
                    }): JSX.Element => {
                        const skalViseMerEnnFireUkerInfoPanel = hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER;

                        const skalViseIngenAvSituasjonenePanel =
                            hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
                            begrunnelse === HvorLengeJobbetFordi.INGEN;

                        const skalViseSmittevernSpørsmål =
                            hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER ||
                            (hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
                                begrunnelse !== HvorLengeJobbetFordi.IKKE_BESVART &&
                                begrunnelse !== HvorLengeJobbetFordi.INGEN);

                        const skalViseSmittevernInfo = skalViseSmittevernSpørsmål && smittevernHensyn === YesOrNo.YES;

                        const skalViseStengtBarnehageSpørsmål = smittevernHensyn === YesOrNo.NO;

                        const skalViseStengtBhgSkoleInfo =
                            skalViseSmittevernInfo !== true && hjemmePgaStengt === YesOrNo.YES;

                        const skalViseGåTilSøknadLink =
                            skalViseSmittevernSpørsmål && smittevernHensyn !== YesOrNo.UNANSWERED;

                        const showNotAllQuestionsAnsweredMessage =
                            !skalViseGåTilSøknadLink && !skalViseIngenAvSituasjonenePanel;

                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error): React.ReactNode => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}
                                noButtonsContentRenderer={
                                    showNotAllQuestionsAnsweredMessage
                                        ? () => (
                                              <UnansweredQuestionsInfo>
                                                  <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                              </UnansweredQuestionsInfo>
                                          )
                                        : undefined
                                }>
                                <FormBlock margin={'xxl'}>
                                    <FormikQuestion
                                        firstAlternative={{
                                            label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                                            value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER,
                                        }}
                                        secondAlternative={{
                                            label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                                            value: HvorLengeJobbet.MER_ENN_FIRE_UKER,
                                        }}
                                        useTwoColumns={true}
                                        name={PageFormField.hvorLengeJobbet}
                                        legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                                    />
                                </FormBlock>

                                {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
                                    <FormBlock>
                                        <FormikRadioPanelGroup
                                            radios={getHvorLengeRadios(intl)}
                                            legend={
                                                <div>
                                                    <p>
                                                        <LabelWithInfo infoPlassering={PopoverOrientering.Over}>
                                                            {intlHelper(intl, 'hvorLengeJobbet.fordi.legend-header')}
                                                        </LabelWithInfo>
                                                    </p>
                                                    <div className={'normal-tekst'}>
                                                        <FormattedMessage id="hvorLengeJobbet.fordi.legend-text" />
                                                    </div>
                                                </div>
                                            }
                                            name={PageFormField.begrunnelse}
                                            useTwoColumns={false}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseIngenAvSituasjonenePanel && (
                                    <Box margin="xl">
                                        <AlertStripeFeil>
                                            <FormattedMessage id="introPage.feil.skalViseIngenAvSituasjonenePanel" />
                                        </AlertStripeFeil>
                                    </Box>
                                )}

                                {skalViseMerEnnFireUkerInfoPanel && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <>
                                                <Box padBottom={'l'}>
                                                    <strong>
                                                        <FormattedMessage id="introPage.feil.skalViseMerEnnFireUkerInfoPanel.1" />
                                                    </strong>
                                                </Box>

                                                <Box>
                                                    <FormattedMessage id="introPage.feil.skalViseMerEnnFireUkerInfoPanel.2" />
                                                </Box>
                                            </>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseSmittevernSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.smittevernHensyn}
                                            legend={intlHelper(intl, 'steg.en.smittevern.sporsmal')}
                                            description={
                                                <ExpandableInfo
                                                    title={intlHelper(
                                                        intl,
                                                        'introPage.info.skalViseSmittevernSpørsmål.title'
                                                    )}>
                                                    <SmittevernInfo />
                                                </ExpandableInfo>
                                            }
                                        />
                                    </FormBlock>
                                )}

                                {skalViseStengtBarnehageSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaStengt}
                                            legend={intlHelper(intl, 'steg.intro.form.spm.hjemmePgaStengt')}
                                        />
                                    </FormBlock>
                                )}

                                {skalViseSmittevernInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="introPage.info.smittevern.1.html" />
                                            </p>
                                            <p>
                                                <FormattedMessage id="introPage.info.smittevern.2" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseStengtBhgSkoleInfo && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                <FormattedHtmlMessage id="steg.intro.stengtBhgSkole.1" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="steg.intro.stengtBhgSkole.2" />
                                            </p>
                                        </AlertStripeInfo>
                                    </Box>
                                )}

                                {skalViseGåTilSøknadLink && (
                                    <>
                                        <Box
                                            margin="xl"
                                            textAlignCenter={true}
                                            className={bem.element('gaTilSoknadenKnappelenkeWrapper')}>
                                            <Knappelenke
                                                type={'hoved'}
                                                href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                                <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                            </Knappelenke>
                                        </Box>
                                    </>
                                )}
                            </PageForm.Form>
                        );
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
