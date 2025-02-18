import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListStaff } from '../../domain/models/Staff/ListStaff.model'; 
import { IStaffRepository } from '../../domain/repositories/IStaff.repository';
import { StaffRepository } from '../../infrastructure/repositories/Staff.repository';
import { CreateStaff } from '../../domain/models/Staff/CreateStaff.model';
import { EditStaffDto } from '../../domain/models/Staff/EditStaff.model';
import { Staffdto } from '../../domain/models/Staff/Staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private _repo: StaffRepository) {}

  getStaffList(): Observable<ListStaff[]> {
    console.log('StaffService: fazendo chamada à API');
    return this._repo.getStaffList();
  }

  createStaff(newStaff: CreateStaff): Observable<CreateStaff> {
    return this._repo.createStaff(newStaff);
  }

  updateStaff(licenseNumber: string, updatedStaff: EditStaffDto): Observable<EditStaffDto> {
    return this._repo.updateStaff(licenseNumber, updatedStaff);
  }

  deactivateStaff(licenseNumber: string): Observable<Staffdto> {
    return this._repo.deactivateStaff(licenseNumber);
  }

}
