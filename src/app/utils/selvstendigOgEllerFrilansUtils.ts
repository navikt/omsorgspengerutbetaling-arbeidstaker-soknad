import { SelvstendigOgEllerFrilans } from '../types/SelvstendigOgEllerFrilansTypes';
import { YesOrNo } from 'common/types/YesOrNo';

export const isSelvstendig = (
    erSelvstendigOgEllerFrilanser?: YesOrNo,
    selvstendigOgEllerFrilans?: SelvstendigOgEllerFrilans[]
): boolean =>
    erSelvstendigOgEllerFrilanser !== undefined &&
    erSelvstendigOgEllerFrilanser === YesOrNo.YES &&
    selvstendigOgEllerFrilans !== undefined &&
    selvstendigOgEllerFrilans.includes(SelvstendigOgEllerFrilans.selvstendig);

export const isFrilanser = (
    erSelvstendigOgEllerFrilanser?: YesOrNo,
    selvstendigOgEllerFrilans?: SelvstendigOgEllerFrilans[]
): boolean =>
    erSelvstendigOgEllerFrilanser !== undefined &&
    erSelvstendigOgEllerFrilanser === YesOrNo.YES &&
    selvstendigOgEllerFrilans !== undefined &&
    selvstendigOgEllerFrilans.includes(SelvstendigOgEllerFrilans.frilans);
