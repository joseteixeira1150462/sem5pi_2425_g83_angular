
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationRequestDto } from '../../domain/models/OperationRequest/OperationRequesDto';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestService {
  private apiUrl = 'http://10.9.11.83:5002/api/OperationRequest';

  constructor(private http: HttpClient) { }

  getAllOperationRequests(): Observable<OperationRequestDto[]> {
    return this.http.get<OperationRequestDto[]>(`${this.apiUrl}/`).pipe(
      catchError(this.handleError)
    );
  }

  createOperationRequest(operationRequest: OperationRequestDto): Observable<OperationRequestDto> {
    return this.http.post<OperationRequestDto>(`${this.apiUrl}`, operationRequest);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch operation requests.'));
  }
}
