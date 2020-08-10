export enum HvorLengeJobbet {
    MINDRE_ENN_FIRE_UKER = 'MINDRE_ENN_FIRE_UKER',
    MER_ENN_FIRE_UKER = 'MER_ENN_FIRE_UKER',
    IKKE_BESVART = 'IKKE_BESVART',
}

export enum HvorLengeJobbetFordi {
    ANNET_ARBEIDSFORHOLD = 'ANNET_ARBEIDSFORHOLD',
    ANDRE_YTELSER = 'ANDRE_YTELSER',
    LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON = 'LOVBESTEMT_FERIE_ELLER_ULØNNET_PERMISJON',
    MILITÆRTJENESTE = 'MILITÆRTJENESTE',
    INGEN = 'INGEN',
    IKKE_BESVART = 'IKKE_BESVART',
}

export enum AnsettelseslengdeFormDataFields {
    hvorLengeJobbet = 'hvorLengeJobbet',
    begrunnelse = 'begrunnelse',
    ingenAvSituasjoneneForklaring = 'ingenAvSituasjoneneForklaring',
}

export interface AnsettelseslengdeFormData {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet;
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi;
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: string;
}

export const initialAnsettelseslengdeFormData: AnsettelseslengdeFormData = {
    [AnsettelseslengdeFormDataFields.hvorLengeJobbet]: HvorLengeJobbet.IKKE_BESVART,
    [AnsettelseslengdeFormDataFields.begrunnelse]: HvorLengeJobbetFordi.IKKE_BESVART,
    [AnsettelseslengdeFormDataFields.ingenAvSituasjoneneForklaring]: '',
};
