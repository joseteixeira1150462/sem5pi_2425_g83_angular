import { Injectable } from "@angular/core";
import { OperationType } from "../../domain/models/OperationType/OperationType.model";
import { OperationTypeDto } from "../../domain/models/OperationType/OperationTypeDto.model";

@Injectable({
    providedIn: 'root',
})
export class OperationTypeMapper {
    toDomain(dto: OperationTypeDto): OperationType {
        return {
            id: dto.id,
            name: dto.name,
            active: dto.active,
            duration: {
                preparation: dto.preparation,
                operation: dto.operation,
                cleaning: dto.cleaning
            },
            specializations: dto.specializations
        }
    }

    toDto(model: OperationType): OperationTypeDto {
        console.log(model);

        return {
            id: model.id,
            name: model.name,
            active: model.active,
            preparation: model.duration.preparation,
            operation: model.duration.operation,
            cleaning: model.duration.cleaning,
            specializations: model.specializations
        }
    }
}