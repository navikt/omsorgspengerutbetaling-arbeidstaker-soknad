import { Attachment } from 'common/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from 'common/utils/attachmentUtils';
import { FraværDag, FraværPeriode } from '@navikt/sif-common-forms/lib';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';

export const hasValue = (v: any): boolean => v !== '' && v !== undefined && v !== null;

export enum AppFieldValidationErrors {
    'arbeidsforhold_fraværPerioder_listIsEmpty' = 'validation.arbeidsforhold.fraværPerioder.listIsEmpty',
    'arbeidsforhold_harPerioderMedFravær_yesOrNoIsUnanswered' = 'validation.arbeidsforhold.harPerioderMedFravær.yesOrNoIsUnanswered',
    'arbeidsforhold_harDagerMedDelvisFravær_yesOrNoIsUnanswered' = 'validation.arbeidsforhold.harDagerMedDelvisFravær.yesOrNoIsUnanswered',
    'arbeidsforhold_fraværDager_listIsEmpty' = 'validation.arbeidsforhold.fraværDager.listIsEmpty',
    'arbeidsforhold_hvorLengeJobbet_noValue' = 'validation.arbeidsforhold.hvorLengeJobbet.noValue',
    'arbeidsforhold_ansettelseslengde_begrunnelse_noValue' = 'validation.arbeidsforhold.ansettelseslengde.begrunnelse.noValue',
    'periode_ingenDagerEllerPerioder' = 'validation.periode_ingenDagerEllerPerioder',
    'harHattFraværHosArbeidsgiver_yesOrNoIsUnanswered' = 'validation.harHattFraværHosArbeidsgiver.yesOrNoIsUnanswered',
    'arbeidsgiverHarUtbetaltLønn_yesOrNoIsUnanswered' = 'validation.arbeidsgiverHarUtbetaltLønn.yesOrNoIsUnanswered',
    'for_mange_dokumenter' = 'validation.for_mange_dokumenter',
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
    'ingen_dokumenter' = 'validation.ingen_dokumenter',
    'fraværDagIkkeSammeÅrstall' = 'validation.fraværDagIkkeSammeÅrstall',
    'fraværPeriodeIkkeSammeÅrstall' = 'validation.fraværPeriodeIkkeSammeÅrstall',
    'perioderEllerDagerOverlapper' = 'validation.perioderEllerDagerOverlapper',
    'arbeidsforhold_utbetalings_årsak_no_Value' = 'validation.situasjon.arbeidsforhold.utbetalingsårsak.noValue',
    'arbeidsforhold_årsak_mindre_4uker_no_Value' = 'validation.situasjon.arbeidsforhold.ÅrsakMindre4Uker.noValue',
}

export const attachmentsAreValid = (attachments: Attachment[]): boolean => {
    const uploadedAttachments = attachments.filter((attachment) => {
        return attachment ? attachmentHasBeenUploaded(attachment) : false;
    });
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return false;
    }
    if (uploadedAttachments.length > 100) {
        return false;
    }
    return true;
};

export const alleDokumenterISøknadenToFieldValidationResult = (
    attachments: Attachment[]
): ValidationResult<ValidationError> => {
    const uploadedAttachments = attachments.filter((attachment) => {
        return attachment ? attachmentHasBeenUploaded(attachment) : false;
    });
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.for_mange_dokumenter;
    }
    return undefined;
};

export const getFraværPerioderValidator = ({
    fraværDager,
    årstall,
}: {
    fraværDager: FraværDag[];
    årstall?: number;
}) => (fraværPerioder: FraværPeriode[]) => {
    return validateAll<ValidationError>([
        () =>
            getListValidator({ required: true })(fraværPerioder)
                ? {
                      key: AppFieldValidationErrors.arbeidsforhold_fraværPerioder_listIsEmpty,
                      keepKeyUnaltered: true,
                  }
                : undefined,
        () =>
            fraværPerioderHarÅrstall(fraværPerioder, årstall) === false
                ? AppFieldValidationErrors.fraværPeriodeIkkeSammeÅrstall
                : undefined,
        () =>
            validateNoCollisions(fraværDager, fraværPerioder)
                ? AppFieldValidationErrors.perioderEllerDagerOverlapper
                : undefined,
    ]);
};

export const getFraværDagerValidator = ({
    fraværPerioder,
    årstall,
}: {
    fraværPerioder: FraværPeriode[];
    årstall?: number;
}) => (fraværDager: FraværDag[]) => {
    return validateAll<ValidationError>([
        () =>
            getListValidator({ required: true })(fraværDager)
                ? {
                      key: AppFieldValidationErrors.arbeidsforhold_fraværDager_listIsEmpty,
                      keepKeyUnaltered: true,
                  }
                : undefined,

        () =>
            fraværDagerHarÅrstall(fraværDager, årstall) === false
                ? AppFieldValidationErrors.fraværDagIkkeSammeÅrstall
                : undefined,
        () =>
            validateNoCollisions(fraværDager, fraværPerioder)
                ? AppFieldValidationErrors.perioderEllerDagerOverlapper
                : undefined,
    ]);
};

const fraværPerioderHarÅrstall = (perioder: FraværPeriode[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return perioder.find((p) => p.fraOgMed.getFullYear() !== årstall || p.tilOgMed.getFullYear() !== årstall)
            ? false
            : true;
    }
    return true;
};

const fraværDagerHarÅrstall = (dager: FraværDag[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return dager.find((d) => d.dato.getFullYear() !== årstall) ? false : true;
    }
    return true;
};
