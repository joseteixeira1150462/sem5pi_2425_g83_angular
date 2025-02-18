import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPatientRepository } from '../../domain/repositories/IPatient.repository';
import { Observable, catchError, throwError } from 'rxjs';
import { CreatePatient } from '../../domain/models/Patient/CreatePatient.model';
import { EditPatient } from '../../domain/models/Patient/EditPatient.model';
import { ListPatient } from '../../domain/models/Patient/ListPatient.model';
import { PatientDto } from '../../domain/models/Patient/PatientDto.model';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../domain/models/Users/User.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PatientRepository extends IPatientRepository {
  
  private baseUrl = `${environment.apiUrl}`
  private controller = '/patients';

  private fullUrl = this.baseUrl + this.controller;

  constructor(private http: HttpClient) {
    super();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken'); 
    if (!token) {
      console.error('Token JWT não encontrado!');
      return new HttpHeaders(); // Retorna cabeçalhos vazios se o token não for encontrado
    }
    console.log('Token JWT encontrado:', token);
    return new HttpHeaders({ 
      Authorization: `Bearer ${token}`
    });
  }

  createPatient(newPatient: CreatePatient): Observable<any> {
    return this.http.post<PatientDto>(this.fullUrl, newPatient).pipe(
      catchError((error) => {
        console.error('Erro ao criar patient:', error);
        return throwError(() => error);
      })
    );
  }

  editPatient(patient: EditPatient): Observable<any> {
    const url = `${this.fullUrl}/${encodeURIComponent(patient.email)}`; // Codificando o email na URL
    return this.http.put<PatientDto>(url, patient).pipe(
      catchError((error) => {
        console.error('Erro ao editar patient:', error);
        return throwError(() => error);
      })
    );
  }

  getPatientByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.fullUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar o patientId pelo userId:', error);
        return throwError(() => error);
      })
    );
  }

  getPatientById(patientId: string): Observable<PatientDto> {
    return this.http.get<PatientDto>(`${this.fullUrl}/${patientId}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar o patientId:', error);
        return throwError(() => error);
      })
    );
  }

  getAllPatients(): Observable<ListPatient[]> {
    return this.http.get<ListPatient[]>(this.fullUrl).pipe(
      catchError((error) => {
        console.error('Erro ao buscar a lista de pacientes no repo:', error);
        return throwError(() => error);
      })
    );
  }
}
