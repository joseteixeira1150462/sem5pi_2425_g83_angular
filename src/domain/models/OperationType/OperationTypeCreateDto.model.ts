import { OperationTypeSpecialization } from "./OperationTypeSpecialization.model";

export interface OperationTypeCreateDto {
    name: string,
    preparation: number,
    operation: number,
    cleaning: number,
    specializations: OperationTypeSpecialization[]
}