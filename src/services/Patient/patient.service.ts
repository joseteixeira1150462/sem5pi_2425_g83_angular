import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepository } from '../../infrastructure/repositories/Patient.repository';
import { CreatePatient } from '../../domain/models/Patient/CreatePatient.model';
import { EditPatient } from '../../domain/models/Patient/EditPatient.model';
import { ListPatient } from '../../domain/models/Patient/ListPatient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private _repo: PatientRepository) { }

  createPatient(newPatient: CreatePatient): Observable<CreatePatient> {
    return this._repo.createPatient(newPatient);
  }

  editPatient(editPatient: EditPatient): Observable<EditPatient> {
    return this._repo.editPatient(editPatient);
  }

  getPatientByUserId(userId: string): Observable<any> {
    return this._repo.getPatientByUserId(userId);
  }

  getPatientById(patientId: string): Observable<any>{
    return this._repo.getPatientById(patientId);
  }

  getListPatients(): Observable<ListPatient[]>{
    return this._repo.getAllPatients();
  }
}