export interface ListPatient{
        id: string; 
        firstName: string;
        lastName: string;
        fullName: string;
        birthDate: Date; 
        gender: string;
        medicalRecordNumber: string; 
        email: string;
        phone: string; 
        emergencyPhone: string; 
        updatesExecuted: number; 
        sequentialNumber: number;
    }