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

const bem = bemUtils('introPage');

// enum PageFormField {
//     'erSelvstendigEllerFrilanser' = 'erSelvstendigEllerFrilanser'
// }

// interface PageFormValues {
//     [PageFormField.erSelvstendigEllerFrilanser]: YesOrNo;
// }

// const initialValues = {};
// const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.StatelessComponent = () => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>{intlHelper(intl, 'informasjon.nar_kan_man_fa_utbetalt')}</p>

                    <ul>
                        <li>
                            de har jobbet hos nåværende arbeidsgiver i mindre enn 4 uker, men har forut dette arbeidsforhold hatt et annet arbeidsforhold eller en ytelse fra NAV som likestilles med arbeidsforhold (dagpenger, foreldrepenger, pleiepenger, opplæringspenger, svangerskapspenger)
                        </li>
                        <p />
                        <li>
                            du har vært i militærtjeneste.
                        </li>
                        <p />
                        <li>
                            du har hatt ulønnet permisjon direkte etter en periode med foreldrepenger og har avtalt med arbeidsgiveren din at du skal gjenoppta arbeidet etter permisjonen.
                        </li>
                        <p />
                        <li>
                            du har hatt lovbestemt ferie.
                        </li>
                        <p />
                        <li>
                             annet (det må hete annet i søknaden + friteksfelt) - noen arbeidsgivere nekter å utbetale til tross for at arbeidstaker har rett og arbeidsgiver har forskutteringsplikt.
                        </li>
                        <p />
                    </ul>
                    <p />
                    I disse tilfellene kan du søke om utbetaling fra NAV.


                </InformationPoster>
            </Box>
            {/*<FormBlock>*/}
            {/*    <PageForm.FormikWrapper*/}
            {/*        onSubmit={() => null}*/}
            {/*        initialValues={initialValues}*/}
            {/*        renderForm={({ values: { erSelvstendigEllerFrilanser } }) => (*/}
            {/*            <PageForm.Form*/}
            {/*                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}*/}
            {/*                includeButtons={false}>*/}
            {/*                <PageForm.YesOrNoQuestion*/}
            {/*                    name={PageFormField.erSelvstendigEllerFrilanser}*/}
            {/*                    legend="Er du selvstendig næringsdrivende eller frilanser?"*/}
            {/*                />*/}
            {/*                {erSelvstendigEllerFrilanser === YesOrNo.NO && (*/}
            {/*                    <Box margin="xl">*/}
            {/*                        <AlertStripeInfo>*/}
            {/*                            <p style={{ marginTop: 0, marginBottom: 0 }}>*/}
            {/*                                Denne søknaden gjelder <strong>kun</strong> for selvstendig næringsdrivende*/}
            {/*                                og frilansere som skal søke om utbetaling av omsorgspenger.*/}
            {/*                            </p>*/}
            {/*                            <p>*/}
            {/*                                Hvis du er arbeidstaker, skal du ikke søke om utbetaling av omsorgspenger.*/}
            {/*                                Arbeidsgiveren din skal utbetale deg lønn som vanlig de dagene du tar ut*/}
            {/*                                omsorgsdager.*/}
            {/*                            </p>*/}
            {/*                        </AlertStripeInfo>*/}
            {/*                    </Box>*/}
            {/*                )}*/}
            {/*                {erSelvstendigEllerFrilanser === YesOrNo.YES && (*/}
            {/*                    <Box margin="xl" textAlignCenter={true}>*/}
            {/*                        <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>*/}
            {/*                            <FormattedMessage id="gotoApplicationLink.lenketekst" />*/}
            {/*                        </Lenke>*/}
            {/*                    </Box>*/}
            {/*                )}*/}
            {/*            </PageForm.Form>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</FormBlock>*/}
            <Box margin="xl" textAlignCenter={true}>
                <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                    <FormattedMessage id="gotoApplicationLink.lenketekst" />
                </Lenke>
            </Box>
        </Page>
    );
};

export default IntroPage;
