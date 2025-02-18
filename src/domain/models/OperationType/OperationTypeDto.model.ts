import { OperationTypeSpecialization } from "./OperationTypeSpecialization.model";

export interface OperationTypeDto {
    id: string,
    name: string,
    active: boolean,
    preparation: number,
    operation: number,
    cleaning: number,
    specializations: OperationTypeSpecialization[]
}