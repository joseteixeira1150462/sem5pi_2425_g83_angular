import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MedicalConditionCreateDto } from "../domain/models/MedicalCondition/MedicalConditionCreateDto";
import { MedicalCondition } from "../domain/models/MedicalCondition/MedicalCondition";
import { environment } from "../environments/environment";
import { MedicalConditionUpdateDto } from "../domain/models/MedicalCondition/MedicalConditionUpdate"; 

@Injectable({
    providedIn: 'root'
})
export class MedicalConditionService {
    private baseUrl = `${environment.njsApiUrl}/medicalCondition`

    constructor(
        private http: HttpClient
    ) { }

    create(medicalConditionDto: MedicalConditionCreateDto): Observable<boolean> {
        return this.http.post<MedicalCondition>(this.baseUrl, medicalConditionDto).pipe(
            map((response) => {
                return true;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    search(searchTerm?: string): Observable<MedicalCondition[]> {
        let queryString: string = "";

        if (searchTerm !== undefined && searchTerm !== "") {
            queryString = `?code=${searchTerm}&designation=${searchTerm}&description=${searchTerm}`
        }

        return this.http.get<MedicalCondition[]>(this.baseUrl + queryString).pipe(
            map((response) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    getByDomainId(id: string): Observable<MedicalCondition> {
        return this.http.get<MedicalCondition>(this.baseUrl + "/" + id).pipe(
            map((response) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    update(medicalConditionId: string, medicalConditionUpdateDto: MedicalConditionUpdateDto): Observable<boolean> {
        return this.http.patch<MedicalCondition>(this.baseUrl + "/" + medicalConditionId, medicalConditionUpdateDto).pipe(
            map((response) => {
                return true;
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
}