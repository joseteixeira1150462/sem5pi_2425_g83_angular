import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { EditPatient } from '../../../../domain/models/Patient/EditPatient.model'; // Uso correto do modelo
import { PatientService } from '../../../../services/Patient/patient.service';

@Component({
  selector: 'app-edit-patient',
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
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {
  editForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isEmailUpdating: boolean = false;
  currentEmail: string = ''; // Armazenando o email atual do paciente

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      phone: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Recuperar userId do localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('Erro: userId não encontrado no localStorage.');
      return;
    }

    // Buscar o patientId associado ao userId
    this.patientService.getPatientByUserId(userId).subscribe({
      next: (patientId: string) => {
        this.loadPatientData(patientId);
      },

      error: (err) => {
        console.error('Erro ao buscar o patientId:', err);
      }
    });
  }

  // Método para salvar os dados de paciente
  onSave(): void {
    if (this.editForm.valid) {
      const patientData: EditPatient = { ...this.editForm.value };

      this.patientService.editPatient(patientData).subscribe({
        next: () => {
          this.snackBar.open('Dados salvos com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erro ao salvar os dados. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios!', 'Fechar', { duration: 3000 });
    }
  }

  onUpdateEmail(): void {
    // Verifica se o formulário é válido
    if (this.editForm.valid) {
      const patientData: EditPatient = { ...this.editForm.value };
      const email = patientData.email;  // Usar o e-mail a partir do patientData
  
      // Verificar se o e-mail foi alterado antes de tentar enviar a solicitação
      if (email === this.currentEmail) {
        this.snackBar.open('O novo e-mail deve ser diferente do atual.', 'Fechar', { duration: 3000 });
        return;
      }
  
      this.isEmailUpdating = true;
  
      // Montar o payload conforme esperado pela API
      const body = {
        CurrEmail: {
          Address: this.currentEmail // O e-mail atual
        },
        NewEmail: {
          Address: email // O novo e-mail
        }
      };
  
      // Enviar a requisição para a API para atualizar o e-mail
      this.http.patch(`/api/users/email/${encodeURI(body.CurrEmail.Address)}`, body).subscribe({
        next: (response) => {
          // Exibir mensagem de sucesso após a solicitação ser enviada com sucesso
          this.snackBar.open('Solicitação de alteração de e-mail enviada com sucesso! Confira o seu novo e-mail para confirmar.', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          let errorMessage = 'Erro ao solicitar a alteração de e-mail. Tente novamente.';
          if (err?.status === 400) {
            errorMessage = 'O e-mail já está em uso. Por favor, escolha outro.';
          }
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        },
        complete: () => {
          this.isEmailUpdating = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios!', 'Fechar', { duration: 3000 });
    }
  }
  

  loadPatientData(patientId: string): void {
    this.patientService.getPatientById(patientId).subscribe({
      next: (patientData) => {
        const date = new Date(patientData.birthDate);
        const formattedDate = date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0];

        this.editForm.patchValue({
          email: patientData.email,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          birthDate: formattedDate,  // Coloca a data formatada aqui
          phone: patientData.phone,
          emergencyPhone: patientData.emergencyPhone,
          gender: patientData.gender
        });

        // Armazenar o e-mail atual
        this.currentEmail = patientData.email;
      },
      error: (err) => {
        console.error('Erro ao carregar os dados do paciente:', err);
      }
    });
  }
}
