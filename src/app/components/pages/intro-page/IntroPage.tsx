import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

const bem = bemUtils('introPage');

enum PageFormField {
    'noeSomGjelderForDeg' = 'noeSomGjelderForDeg'
}

interface PageFormValues {
    [PageFormField.noeSomGjelderForDeg]: YesOrNo;
}

const initialValues: PageFormValues = {
    [PageFormField.noeSomGjelderForDeg]: YesOrNo.UNANSWERED
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.StatelessComponent = () => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>
                        Hvis du ikke har rett på omsorgspenger hos arbeidsgiveren din, kan du likevel ha rett til det
                        fra NAV. Dette kan være når du har vært mindre enn 4 uker i den nye jobben din, men direkte før
                        det,​
                    </p>
                    <ul>
                        <li>jobbet du hos en annen arbeidsgiver​</li>
                        <p />
                        <li>
                            mottok du dagpenger, sykepenger, pleiepenger, omsorgspenger, opplæringspenger,
                            foreldrepenger eller svangerskapspenger.
                        </li>
                        <p />
                        <li>var du i militærtjeneste. ​</li>
                        <p />
                        <li>
                            hadde du ulønnet permisjon direkte etter en periode med foreldrepenger, og du har nå
                            gjenopptatt arbeidet etter permisjonen.​
                        </li>
                        <p />
                    </ul>
                    <p />
                    Hvis minst én av situasjonene over gjelder for deg, kan du gå til den digitale søknaden.​
                </InformationPoster>
            </Box>

            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({ values: { noeSomGjelderForDeg } }) => {
                        const skalViseGåTilSøknadLink = noeSomGjelderForDeg !== YesOrNo.UNANSWERED;
                        const skalViseInfoPanel = noeSomGjelderForDeg === YesOrNo.NO;
                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}>
                                <PageForm.YesOrNoQuestion
                                    name={PageFormField.noeSomGjelderForDeg}
                                    legend="Gjelder en av situasjonene beskrevet over for deg?"
                                />

                                {skalViseInfoPanel && (
                                    <Box margin="xl">
                                        <AlertStripeInfo>
                                            <>
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    <strong>
                                                        Gjelder ingen av situasjonene for deg, og likevel utbetaler ikke
                                                        arbeidsgiver omsorgspenger?​
                                                    </strong>
                                                </p>
                                                <p>
                                                    I slike tilfeller sender du inn en søknad. I søknaden må du laste
                                                    opp en skriftlig forklaring fra arbeidsgiveren din om hvorfor de
                                                    ikke utbetaler omsorgspenger til deg. ​
                                                </p>
                                            </>
                                        </AlertStripeInfo>
                                    </Box>
                                )}
                                {skalViseGåTilSøknadLink && (
                                    <>
                                        <Box margin="xl" textAlignCenter={true}>
                                            <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                                <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                            </Lenke>
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
