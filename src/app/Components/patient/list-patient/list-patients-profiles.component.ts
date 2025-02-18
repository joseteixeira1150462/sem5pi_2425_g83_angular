import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../services/Patient/patient.service';
import { ListPatient } from '../../../../domain/models/Patient/ListPatient.model'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-patient',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './list-patients-profiles.component.html',
  styleUrls: ['./list-patients-profiles.component.scss']
})
export class ListPatientComponent implements OnInit {
  patientList: ListPatient[] = []; // Lista de pacientes

  constructor(
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getListPatients().subscribe({
      next: (data) => {
        this.patientList = data.map((patient:any) => ({
          id: patient.id, 
          firstName: patient.firstName, 
          lastName: patient.lastName, 
          fullName: patient.fullName, 
          birthDate: new Date(patient.birthDate), 
          gender: patient.gender, 
          medicalRecordNumber: patient.medicalRecordNumber,
          email: patient.email, 
          phone: patient.phone, 
          emergencyPhone: patient.emergencyPhone,
          updatesExecuted: patient.updatesExecuted, // Atualizações  ao perfil executadas
          sequentialNumber: patient.sequentialNumber // Número sequencial do paciente
        }));
      },
      error: (err) => console.error('Erro ao buscar lista de pacientes:', err)
    });
  }
}
