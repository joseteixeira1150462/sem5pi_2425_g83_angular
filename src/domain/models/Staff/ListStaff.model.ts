import { TimeSlotDto } from './TimeSLot.model';

export interface ListStaff {
  firstname: string;
  lastname: string;
  specialization: string;
  phone: string;
  email: string;
  licensenumber: string;
  avaibilityslots?: TimeSlotDto[]; 
}
