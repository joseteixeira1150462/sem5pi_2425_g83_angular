import { TimeSlotDto } from "./TimeSLot.model"; 

export interface Staffdto {
  id: string; 
  firstName: string;
  lastName: string;
  fullName: string;
  licenseNumber: string;
  specialization: string;
  staffEmail: string;
  phone: string;
  avaibilityslots?: TimeSlotDto[];
}
