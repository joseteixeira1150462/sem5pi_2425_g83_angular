import { Injectable } from "@angular/core";
import { OperationTypeRepository } from "../infrastructure/repositories/OperationType.repository";
import { catchError, map, Observable, throwError } from "rxjs";
import { OperationType } from "../domain/models/OperationType/OperationType.model";
import { OperationTypeDto } from "../domain/models/OperationType/OperationTypeDto.model";
import { OperationTypeMapper } from "../infrastructure/mappers/OperationType.mapper";
import { HttpErrorResponse } from "@angular/common/http";
import { OperationTypeCreateDto } from "../domain/models/OperationType/OperationTypeCreateDto.model";

@Injectable({
    providedIn: 'root'
})
export class OperationTypeService {
    constructor(
        private _repo: OperationTypeRepository,
        private _mapper: OperationTypeMapper
    ) { }

    search(): Observable<OperationTypeDto[]> {
        return this._repo.getAll().pipe(
            map((data) => {
                return data.map((record: OperationType) => (
                    this._mapper.toDto(record)
                ));
            }),
            catchError((error: HttpErrorResponse) => throwError(() => new Error(error.message)))
        );
    }

    create(operationType: OperationTypeCreateDto): Observable<boolean> {
        return this._repo.create(operationType).pipe(
            map(() => {
                return true;
            }),
            catchError((error: HttpErrorResponse) => throwError(() => new Error(error.message)))
        );
    }

    delete(id: string): Observable<boolean> {
        return this._repo.delete(id).pipe(
            map((result) => {
                return result;
            }),
            catchError((error: HttpErrorResponse) => throwError(() => new Error(error.message)))
        );
    }
}