import { TimeSlotDto } from "./TimeSLot.model";

export interface EditStaffDto {
    phone: string; 
    availabilitySlots: TimeSlotDto[]; 
  }