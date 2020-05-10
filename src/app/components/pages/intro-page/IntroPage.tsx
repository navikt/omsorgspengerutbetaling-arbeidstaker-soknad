import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';
import {
    FormikRadioPanelGroup,
    FormikTextarea,
    getTypedFormComponents,
    LabelWithInfo
} from '@navikt/sif-common-formik/lib';
import { YesOrNo } from 'common/types/YesOrNo';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import FormikQuestion from '../../formik-question/FormikQuestion';
import { HvorLengeJobbet, HvorLengeJobbetFordi } from '../../../types/AnsettelseslengdeTypes';
import { PopoverOrientering } from 'nav-frontend-popover';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import ExpandableInfo from '../../expandable-content/ExpandableInfo';
import PictureScanningGuide from '../../picture-scanning-guide/PictureScanningGuide';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateDocuments } from '../../../validation/fieldValidations';
import { ArbeidsforholdFormDataFields } from '../../../types/ArbeidsforholdTypes';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import UploadedDocumentsList from '../../uploaded-documents-list/UploadedDocumentsList';
import { getRadioTextIdHvorLengeJobbetFordi } from '../../formik-arbeidsforhold/FormikArbeidsforholdArbeidslengde';

const bem = bemUtils('introPage');

enum PageFormField {
    hvorLengeJobbet = 'hvorLengeJobbet',
    begrunnelse = 'begrunnelse'
}

interface PageFormValues {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet;
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi;
}

const initialValues: PageFormValues = {
    [PageFormField.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
    [PageFormField.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART
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
                    onSubmit={() => null}
                    initialValues={initialValues}
                    renderForm={({ values: { hvorLengeJobbet, begrunnelse } }) => {
                        const skalViseGåTilSøknadLink =
                            hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER ||
                            (hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
                                begrunnelse !== HvorLengeJobbetFordi.IKKE_BESVART &&
                                begrunnelse !== HvorLengeJobbetFordi.INGEN);

                        const skalViseMerEnnFireUkerInfoPanel = hvorLengeJobbet === HvorLengeJobbet.MER_ENN_FIRE_UKER;

                        const skalViseIngenAvSituasjonenePanel =
                            hvorLengeJobbet === HvorLengeJobbet.MINDRE_ENN_FIRE_UKER &&
                            begrunnelse === HvorLengeJobbetFordi.INGEN;

                        return (
                            <PageForm.Form
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
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
                                                            <FormattedHTMLMessage id="hvorLengeJobbet.fordi.legend-text" />
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
                                                        Vanligvis skal arbeidsgiver utbetale omsorgspenger når du har
                                                        jobbet hos dem i mer enn 4 uker.
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
