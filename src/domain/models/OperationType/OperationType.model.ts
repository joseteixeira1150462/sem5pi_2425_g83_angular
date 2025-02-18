import { OperationTypeDuration } from "./OperationTypeDuration.model";
import { OperationTypeSpecialization } from "./OperationTypeSpecialization.model";

export interface OperationType {
    id: string,
    name: string,
    active: boolean,
    duration: OperationTypeDuration,
    specializations: OperationTypeSpecialization[]
}