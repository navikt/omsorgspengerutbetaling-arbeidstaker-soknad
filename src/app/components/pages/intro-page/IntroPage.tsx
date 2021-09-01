import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { getTypedFormComponents, UnansweredQuestionsInfo, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
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
import './introPage.less';

const bem = bemUtils('introPage');

enum PageFormField {
    hjemmePgaStengt = 'hjemmePgaStengt',
    smittevernHensyn = 'smittevernHensyn',
}

interface PageFormValues {
    [PageFormField.hjemmePgaStengt]: YesOrNo;
    [PageFormField.smittevernHensyn]: YesOrNo;
}

const initialValues: PageFormValues = {
    [PageFormField.hjemmePgaStengt]: YesOrNo.UNANSWERED,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED,
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.FC = (): JSX.Element => {
    const intl = useIntl();

    useLogSidevisning(SIFCommonPageKey.intro);

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

                    <ul>
                        <li>
                            <FormattedMessage id="introPage.info.2.item.1" />
                        </li>
                        <li>
                            <FormattedMessage id="introPage.info.2.item.2" />
                        </li>
                        <li>
                            <FormattedMessage id="introPage.info.2.item.3" />
                        </li>
                    </ul>
                    <p>
                        <FormattedMessage id="introPage.info.3" />
                    </p>
                </InformationPoster>
            </Box>

            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={(): null => null}
                    initialValues={initialValues}
                    renderForm={({ values: { smittevernHensyn, hjemmePgaStengt } }): JSX.Element => {
                        const skalViseSmittevernInfo = smittevernHensyn === YesOrNo.YES;

                        const skalViseStengtBarnehageSpørsmål = smittevernHensyn === YesOrNo.NO;

                        const skalViseStengtBhgSkoleInfo =
                            smittevernHensyn === YesOrNo.NO && hjemmePgaStengt === YesOrNo.YES;

                        const skalViseGåTilSøknadLink =
                            skalViseSmittevernInfo ||
                            (skalViseStengtBarnehageSpørsmål && hjemmePgaStengt !== YesOrNo.UNANSWERED);

                        const showNotAllQuestionsAnsweredMessage = !skalViseGåTilSøknadLink;

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
                                <FormBlock>
                                    <PageForm.YesOrNoQuestion
                                        name={PageFormField.smittevernHensyn}
                                        legend={intlHelper(intl, 'introPage.smittevern.spm')}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'introPage.info.skalViseSmittevernSpørsmål.title'
                                                )}>
                                                <FormattedHtmlMessage id="introPage.info.smittevern.html" />
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>

                                {skalViseStengtBarnehageSpørsmål && (
                                    <FormBlock>
                                        <PageForm.YesOrNoQuestion
                                            name={PageFormField.hjemmePgaStengt}
                                            legend={intlHelper(intl, 'introPage.form.spm.hjemmePgaStengt')}
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
                                                <FormattedHtmlMessage id="introPage.stengtBhgSkole.1" />
                                            </p>
                                            <p>
                                                <FormattedHtmlMessage id="introPage.stengtBhgSkole.2" />
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
