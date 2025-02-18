import { TimeSlotDto } from "./TimeSLot.model"; 

export interface CreateStaff {
  firstName: string;
  lastName: string;
  specialization: string;
  phone: string;
  availabilitySlots: TimeSlotDto[]; 
  role: string;
}
