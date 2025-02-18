import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AllergyCreateDto } from "../domain/models/Allergy/AllergyCreateDto";
import { Allergy } from "../domain/models/Allergy/Allergy";
import { environment } from "../environments/environment";
import { AllergyUpdateDto } from "../domain/models/Allergy/AllergyUpdateDto";

@Injectable({
    providedIn: 'root'
})
export class AllergyService {
    private baseUrl = `${environment.njsApiUrl}/allergies`

    constructor(
        private http: HttpClient
    ) { }

    create(allergyDto: AllergyCreateDto): Observable<boolean> {
        return this.http.post<Allergy>(this.baseUrl, allergyDto).pipe(
            map((response) => {
                return true;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    search(searchTerm?: string): Observable<Allergy[]> {
        let queryString: string = "";

        if (searchTerm !== undefined && searchTerm !== "") {
            queryString = `?code=${searchTerm}&designation=${searchTerm}&description=${searchTerm}`
        }

        return this.http.get<Allergy[]>(this.baseUrl + queryString).pipe(
            map((response) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    getById(id: string): Observable<Allergy> {
        return this.http.get<Allergy>(this.baseUrl + "/" + id).pipe(
            map((response) => {
                return response;
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    update(allergyId: string, allergyUpdateDto: AllergyUpdateDto): Observable<boolean> {
        return this.http.patch<Allergy>(this.baseUrl + "/" + allergyId, allergyUpdateDto).pipe(
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