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
import { CreateStaff } from '../../../../domain/models/Staff/CreateStaff.model';
import { StaffService } from '../../../../services/Staff/staff.service';

@Component({
  selector: 'app-createstaff',
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
  templateUrl: './createstaff.component.html',
  styleUrls: ['./createstaff.component.scss']
})
export class CreateStaffComponent implements OnInit {
  successMessage: string | null = null; 
  errorMessage: string | null = null;
  staffForm!: FormGroup;
  filteredSpecializations: string[] = [];
  roles = ['Doctor', 'Nurse', 'Technician'];
  specializations = [
    'Anaesthetist',
    'Instrumenting',
    'Circulating',
    'MedicalActionAssistant',
    'Orthopaedist',
    'XrayTechnician'
  ];

  constructor(private fb: FormBuilder, private staffService: StaffService) {}

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialization:  [{ value: '', disabled: true }, Validators.required],
      role: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      availabilitySlots: this.fb.array([]), 
      date: ['', Validators.required], 
      startTime: ['', Validators.required], 
      endTime: ['', Validators.required], 
    });

    // Especializações permitidas por função
  const specializationMap: { [key: string]: string[] } = {
    Nurse: ['Instrumenting', 'Circulating', 'Anaesthetist'],
    Doctor: ['Orthopaedist', 'Anaesthetist', 'MedicalActionAssistant'],
    Technician: ['XrayTechnician']
  };

    
  this.staffForm.get('role')?.valueChanges.subscribe((roleValue) => {
    const specializationControl = this.staffForm.get('specialization');

    if (roleValue) {
      //  filtra opções com base no 'role'
      this.filteredSpecializations =
        specializationMap[roleValue] || []; // Obtém as especializações permitidas
      specializationControl?.enable(); // Habilita o campo
    } else {
      
      specializationControl?.disable();
      specializationControl?.reset();
      this.filteredSpecializations = []; 
    }
  });
  }

  // Getter para o FormArray de horários
  get availabilitySlots(): FormArray {
    return this.staffForm.get('availabilitySlots') as FormArray;
  }

  addSlot(): void {
    const dateValue = this.staffForm.get('date')?.value;
    const startTimeValue = this.staffForm.get('startTime')?.value;
    const endTimeValue = this.staffForm.get('endTime')?.value;

    if (dateValue && startTimeValue && endTimeValue) {
      const [startHours, startMinutes] = startTimeValue.split(':').map(Number);
      const [endHours, endMinutes] = endTimeValue.split(':').map(Number);

      const startDate = new Date(dateValue);
      startDate.setHours(startHours, startMinutes);

      const endDate = new Date(dateValue);
      endDate.setHours(endHours, endMinutes);

      if (startDate < endDate) {
        this.availabilitySlots.push(this.fb.control({ start: startDate, end: endDate }));
      } else {
        console.error('Hora de início deve ser antes da hora de fim.');
      }
    } else {
      console.error('Preencha todos os campos do horário.');
    }
  }

  removeSlot(index: number): void {
    this.availabilitySlots.removeAt(index);
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      // Prepara os dados para envio
      const staffData = {
        firstName: this.staffForm.get('firstName')?.value,
        lastName: this.staffForm.get('lastName')?.value,
        specialization: this.staffForm.get('specialization')?.value,
        role: this.staffForm.get('role')?.value,
        phone: this.staffForm.get('phone')?.value,
        availabilitySlots: this.availabilitySlots.controls.map(control => control.value) // Apenas os horários
      };
  
      // Faz o POST usando o service
      this.staffService.createStaff(staffData).subscribe({
        next: (response) => {
          console.log('Staff criado com sucesso:', response);
          this.successMessage = 'Staff criado com sucesso! '; // Mensagem de sucesso
          this.errorMessage = null;
  
          // Limpar formulário 
          this.staffForm.reset();
          this.availabilitySlots.clear();

          this.staffForm.patchValue({
            role: null,
            specialization: null,
            availabilitySlots: []
          });
        },
        error: (err) => {
          console.error('Erro ao criar staff:', err);
          this.errorMessage = 'Erro ao criar o staff. Por favor, tente novamente.';
          this.successMessage = null;
        },
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.successMessage = null;
    }
  }
  
}

