import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStaffRepository } from '../../domain/repositories/IStaff.repository';
import { Observable, catchError, throwError } from 'rxjs';
import { ListStaff } from '../../domain/models/Staff/ListStaff.model';
import { CreateStaff } from '../../domain/models/Staff/CreateStaff.model';
import { HttpHeaders } from '@angular/common/http';
import { EditStaffDto } from '../../domain/models/Staff/EditStaff.model';
import { Staffdto } from '../../domain/models/Staff/Staff.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffRepository extends IStaffRepository {
    private baseUrl = `${environment.apiUrl}/staff`;

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

  

  getStaffList(): Observable<ListStaff[]> {
   // console.log('Chamando API:', this.baseUrl);
    return this.http.get<ListStaff[]>(this.baseUrl, { headers: this.getAuthHeaders() }     
    ).pipe( 
      catchError((error) => {
        console.error('Erro ao buscar lista de staff:', error);
        return throwError(() => error);
      })
    );
  }
  createStaff(newStaff: CreateStaff): Observable<CreateStaff> {
    return this.http.post<CreateStaff>(this.baseUrl, newStaff, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Erro ao criar staff:', error);
        return throwError(() => error);
      })
    );
  }

  updateStaff(licenseNumber: string, updatedStaff: EditStaffDto): Observable<EditStaffDto> {
    const headers = this.getAuthHeaders();
    return this.http.put<EditStaffDto>(`${this.baseUrl}/${licenseNumber}`, updatedStaff, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao editar staff:', error);
        return throwError(() => error);
      })
    )
  }

  deactivateStaff(licenseNumber: string): Observable<Staffdto> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/${licenseNumber}`; 
    return this.http.delete<Staffdto>(url,{ headers }).pipe(
      catchError((error) => {
        console.error('Erro ao desativar staff:', error);
        return throwError(() => error);
      })
    );
  }
  getStaffById(id: any): Observable<Staffdto> {
    // console.log('Chamando API:', this.baseUrl);
     return this.http.get<Staffdto>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() }     
     ).pipe( 
       catchError((error) => {
         console.error('Erro ao buscar lista de staff:', error);
         return throwError(() => error);
       })
     );
   }
  
}
