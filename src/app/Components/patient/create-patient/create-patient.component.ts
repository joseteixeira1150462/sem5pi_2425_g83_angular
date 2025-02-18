import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePatient } from '../../../../domain/models/Patient/CreatePatient.model';
import { PatientService } from '../../../../services/Patient/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {format} from 'date-fns'

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  patientForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  roles: ['Patient'];
  genders: ['Male', 'Female', 'Other'];
  snackBar: any;

  constructor(private fb: FormBuilder, private patientService: PatientService) {}
  ngOnInit(): void {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: [
        '', 
        [
          Validators.required, 
          Validators.pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/) // Regex corrigido
        ]
      ],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      emergencyPhone: ['', [Validators.required]],
      healthConditions: [''] // Condições de saúde é opcional
    });
  }
  // Método para enviar o formulário
  onSubmit(): void {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
  
      // Converte a data de nascimento para o formato YYYY-MM-DDTHH:MM:SS
      const patientData: CreatePatient = {
        ...formValue,
        birthDate: new Date(formValue.birthDate).toISOString().split('.')[0] // Formato completo ISO
      };
  
      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.patientForm.reset();
          this.successMessage = 'Paciente criado com sucesso!', response;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao criar paciente. Verifique os dados e tente novamente.';
          console.error('Erro ao criar paciente:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios!';
    }
  }  
}
