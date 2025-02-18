import { Observable } from 'rxjs';
import { ListStaff } from '../models/Staff/ListStaff.model';
import { CreateStaff } from '../models/Staff/CreateStaff.model';
import { EditStaffDto } from '../models/Staff/EditStaff.model';
import { Staffdto } from '../models/Staff/Staff.model';

export abstract class IStaffRepository {
  abstract getStaffList(): Observable<ListStaff[]>;
  abstract createStaff(newStaff: CreateStaff): Observable<CreateStaff>;
  abstract updateStaff(licenseNumber: string, updatedStaff: EditStaffDto): Observable<EditStaffDto>;
  abstract deactivateStaff(licenseNumber: string): Observable<Staffdto> ;

}
