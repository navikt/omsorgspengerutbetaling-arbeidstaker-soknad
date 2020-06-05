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
import { FormikRadioPanelGroup, getTypedFormComponents, LabelWithInfo, YesOrNo } from '@navikt/sif-common-formik/lib';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import FormikQuestion from '../../formik-question/FormikQuestion';
import { HvorLengeJobbet, HvorLengeJobbetFordi } from '../../../types/AnsettelseslengdeTypes';
import { PopoverOrientering } from 'nav-frontend-popover';
import { getRadioTextIdHvorLengeJobbetFordi } from '../../formik-arbeidsforhold/FormikArbeidsforholdArbeidslengde';
import SmittevernInfo from '../../information/SmittevernInfo';

const bem = bemUtils('introPage');

enum PageFormField {
    hvorLengeJobbet = 'hvorLengeJobbet',
    begrunnelse = 'begrunnelse',
    smittevernHensyn = 'smittevernHensyn'
}

interface PageFormValues {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet;
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi;
    [PageFormField.smittevernHensyn]: YesOrNo;
}

const initialValues: PageFormValues = {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
    [PageFormField.smittevernHensyn]: YesOrNo.UNANSWERED
};
const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.FC = (): JSX.Element => {
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={(): JSX.Element => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <Box padBottom={'l'}>
                        Hvis du ikke har rett på omsorgspenger hos arbeidsgiveren din, kan du likevel ha rett til det
                        fra NAV.
                    </Box>
                    <Box>
                        Vi vil nå stille deg noen spørsmål som avgjør om du kan ha rett på utbetaling av omsorgspenger
                        fra NAV.
                    </Box>
                </InformationPoster>
            </Box>

            <FormBlock margin="xxl">
                <PageForm.FormikWrapper
                    onSubmit={(): null => null}
                    initialValues={initialValues}
                    renderForm={({ values: { hvorLengeJobbet, begrunnelse, smittevernHensyn } }): JSX.Element => {
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

                        const skalViseGåTilSøknadLink =
                            skalViseSmittevernSpørsmål && smittevernHensyn !== YesOrNo.UNANSWERED;

                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error): React.ReactNode => commonFieldErrorRenderer(intl, error)}
                                includeButtons={false}>
                                <>
                                    <FormBlock margin={'xxl'}>
                                        <FormikQuestion
                                            firstAlternative={{
                                                label: intlHelper(intl, 'hvorLengeJobbet.mindre'),
                                                value: HvorLengeJobbet.MINDRE_ENN_FIRE_UKER
                                            }}
                                            secondAlternative={{
                                                label: intlHelper(intl, 'hvorLengeJobbet.mer'),
                                                value: HvorLengeJobbet.MER_ENN_FIRE_UKER
                                            }}
                                            useTwoColumns={true}
                                            name={PageFormField.hvorLengeJobbet}
                                            legend={intlHelper(intl, 'hvorLengeJobbet.spørsmål')}
                                        />
                                    </FormBlock>

                                    {hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER && (
                                        <FormBlock>
                                            <FormikRadioPanelGroup
                                                radios={[
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            getRadioTextIdHvorLengeJobbetFordi(
                                                                HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD
                                                            )
                                                        ),
                                                        value: HvorLengeJobbetFordi.ANNET_ARBEIDSFORHOLD
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            getRadioTextIdHvorLengeJobbetFordi(
                                                                HvorLengeJobbetFordi.ANDRE_YTELSER
                                                            )
                                                        ),
                                                        value: HvorLengeJobbetFordi.ANDRE_YTELSER
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            getRadioTextIdHvorLengeJobbetFordi(
                                                                HvorLengeJobbetFordi.MILITÆRTJENESTE
                                                            )
                                                        ),
                                                        value: HvorLengeJobbetFordi.MILITÆRTJENESTE
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            getRadioTextIdHvorLengeJobbetFordi(
                                                                HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                                                            )
                                                        ),
                                                        value:
                                                            HvorLengeJobbetFordi.LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            getRadioTextIdHvorLengeJobbetFordi(
                                                                HvorLengeJobbetFordi.INGEN
                                                            )
                                                        ),
                                                        value: HvorLengeJobbetFordi.INGEN
                                                    }
                                                ]}
                                                legend={
                                                    <div>
                                                        <p>
                                                            <LabelWithInfo infoPlassering={PopoverOrientering.Over}>
                                                                {intlHelper(
                                                                    intl,
                                                                    'hvorLengeJobbet.fordi.legend-header'
                                                                )}
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
                                                For at du som arbeidstaker skal ha rett på utbetaling av omsorgspenger
                                                fra NAV, må én av situasjonene over gjelde.
                                            </AlertStripeFeil>
                                        </Box>
                                    )}

                                    {skalViseMerEnnFireUkerInfoPanel && (
                                        <Box margin="xl">
                                            <AlertStripeInfo>
                                                <>
                                                    <Box padBottom={'l'}>
                                                        <strong>
                                                            Vanligvis skal arbeidsgiver utbetale omsorgspenger når du
                                                            har jobbet hos dem i mer enn 4 uker.
                                                        </strong>
                                                    </Box>

                                                    <Box>
                                                        Hvis arbeidsgiver likevel ikke utbetaler, må du i søknaden laste
                                                        opp en forklaring fra arbeidsgiver på hvorfor de ikke utbetaler
                                                        omsorgspenger til deg. Du må også be arbeidsgiver sende
                                                        inntektsmelding til NAV.
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
                                                info={<SmittevernInfo />}
                                            />
                                        </FormBlock>
                                    )}

                                    {skalViseSmittevernInfo && (
                                        <Box margin="xl">
                                            <AlertStripeInfo>
                                                <p style={{ marginTop: 0, marginBottom: 0 }}>
                                                    I søknaden må du laste opp en bekreftelse fra lege. Legen må
                                                    bekrefte at barnet ikke kan gå i barnehage eller skole fordi det er{' '}
                                                    <strong>særlige smittevernhensyn</strong> i forbindelse med
                                                    koronaviruset som må ivaretas for enten barnet eller et
                                                    familiemedlem som barnet bor sammen med. Legen skal ikke oppgi
                                                    diagnose eller hvilket familiemedlem det gjelder.
                                                </p>
                                                <p>
                                                    Hvis du ikke har bekreftelse tilgjengelig når du søker, kan du
                                                    ettersende den. Vi kan ikke behandle søknaden før vi mottar
                                                    bekreftelsen.
                                                </p>
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
                                </>
                            </PageForm.Form>
                        );
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
