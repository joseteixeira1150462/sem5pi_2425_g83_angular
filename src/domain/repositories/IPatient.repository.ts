import { Observable } from 'rxjs';

import { CreatePatient } from '../models/Patient/CreatePatient.model';
import { ListPatient } from '../models/Patient/ListPatient.model';

export abstract class IPatientRepository {
  abstract createPatient(newStaff: CreatePatient): Observable<CreatePatient>;
  abstract getAllPatients(): Observable<ListPatient[]>;
}
