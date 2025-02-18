import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IOperationTypeRepository } from "../../domain/repositories/IOperationType.repository";
import { catchError, map, Observable, throwError } from "rxjs";
import { OperationType } from "../../domain/models/OperationType/OperationType.model";
import { OperationTypeDto } from "../../domain/models/OperationType/OperationTypeDto.model";
import { OperationTypeMapper } from "../mappers/OperationType.mapper";
import { response } from "express";
import { OperationTypeCreateDto } from "../../domain/models/OperationType/OperationTypeCreateDto.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class OperationTypeRepository extends IOperationTypeRepository {
    private baseUrl = `${environment.apiUrl}/operationType`

    constructor(
        private http: HttpClient,
        private _mapper: OperationTypeMapper) {
        super();
    }

    getAll(): Observable<OperationType[]> {
        return this.http.get<OperationTypeDto[]>(this.baseUrl).pipe(
            map((response) => {
                return response.map((record: OperationTypeDto) => this._mapper.toDomain(record));
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    create(operationType: OperationTypeCreateDto): Observable<OperationType> {
        return this.http.post<OperationTypeDto>(this.baseUrl, operationType).pipe(
            map((response) => {
                return this._mapper.toDomain(response)
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    delete(id: string): Observable<boolean> {
        return this.http.patch(`${this.baseUrl}/${id}`, {}).pipe(
            map(() => {
                return true
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage: string;

        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Server-side error: ${error.status} - ${error.statusText}`;

            // Check for specific error messages in the response body
            if (error.error && typeof error.error === 'object') {
                if (error.error.message) {
                    errorMessage = `Error: ${error.error.message}`;
                }
            }
        }

        // Optionally log the error
        console.error('HTTP Error:', errorMessage);

        // Pass the error message to the consumer
        return throwError(() => new Error(errorMessage));
    }
    getOperationTypeById(id: any): Observable<OperationType> {
      // console.log('Chamando API:', this.baseUrl);
       return this.http.get<OperationType>(`${this.baseUrl}/${id}`     
       ).pipe( 
         catchError((error) => {
           console.error('Erro ao buscar lista de staff:', error);
           return throwError(() => error);
         })
       );
     }
}