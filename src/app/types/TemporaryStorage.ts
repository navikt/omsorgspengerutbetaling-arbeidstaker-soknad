import { StepID } from '../config/stepConfig';
import { SøknadFormData } from './SøknadFormData';

export const TemporaryStorageVersion = 2;

interface TemporaryStorageMetadata {
    lastStepID: StepID;
    version: number;
}

export interface TemporaryStorage {
    metadata: TemporaryStorageMetadata;
    formData: Partial<SøknadFormData>;
}
