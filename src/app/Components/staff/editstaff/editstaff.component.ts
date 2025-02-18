import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditStaffDto } from '../../../../domain/models/Staff/EditStaff.model';
import { StaffService } from '../../../../services/Staff/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-staff',
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
  templateUrl: './editstaff.component.html',
  styleUrls: ['./editstaff.component.scss']
})

export class EditStaffComponent implements OnInit {
  staffForm!: FormGroup;
  

  constructor(private fb: FormBuilder,private staffService: StaffService,private router: Router) {}

  ngOnInit(): void {
    // Carrega os dados do LocalStorage
    const staffData = JSON.parse(localStorage.getItem('staffToEdit') || '{}');

    this.staffForm = this.fb.group({
      licenseNumber: [staffData.licensenumber],
      firstName: [staffData.firstname],
      lastName: [staffData.lastname],
      phone: [staffData.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]], // Validação para 9 dígitos
      date: [''], // Para o DatePicker
      startTime: [''], // Para a hora de início
      endTime: [''], // Para a hora de fim
      availabilitySlots: this.fb.array(
        (staffData.avaibilityslots || []).map((slot: any) =>
          this.fb.group({
            start: [slot.start],
            end: [slot.end]
          })
        )
      ),
    });
  }

  // Getter para o FormArray
  get availabilitySlots(): FormArray {
    return this.staffForm.get('availabilitySlots') as FormArray;
  }

  // Adicionar um novo slot
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
        this.availabilitySlots.push(
          this.fb.group({
            start: [startDate],
            end: [endDate]
          })
        );
      } else {
        console.error('Hora de início deve ser antes da hora de fim.');
      }
    } else {
      console.error('Preencha todos os campos do horário.');
    }
  }

  // Remover um slot
  removeSlot(index: number): void {
    this.availabilitySlots.removeAt(index);
  }

  // Submissão do formulário
  onSubmit(): void {
    if (this.staffForm.valid) {
      const updatedStaff: EditStaffDto = {
        phone: this.staffForm.get('phone')?.value,
        availabilitySlots: this.availabilitySlots.value
      };

      const licenseNumber = this.staffForm.get('licenseNumber')?.value;

      this.staffService.updateStaff(licenseNumber, updatedStaff).subscribe({
        next: () => {
          console.log('Staff atualizado com sucesso!');
          this.router.navigate(['/staff/list']); 
        },
        error: (err) => {
          console.error('Erro ao atualizar staff:', err);
        }
      });
    } else {
      console.error('Formulário inválido');
    }
  }
}

