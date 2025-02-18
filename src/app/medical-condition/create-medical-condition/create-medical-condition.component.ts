import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MedicalConditionService } from '../../../services/MedicalCondition.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MedicalConditionCreateDto } from '../../../domain/models/MedicalCondition/MedicalConditionCreateDto';

@Component({
  selector: 'app-create-medical-condition',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './create-medical-condition.component.html',
  styleUrl: './create-medical-condition.component.scss'
})
export class CreateMedicalConditionComponent {
 public medicalConditionForm: FormGroup;

  errorMessages = signal<{ [key: string]: string | null }>({});

  constructor(
    protected _router: Router,
    protected _service: MedicalConditionService
  ) {
    this.initForm();

    merge(
      ...Object.values(this.medicalConditionForm.controls).map(control =>
        merge(control.statusChanges, control.valueChanges)
      )
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  private initForm(): void {
    this.medicalConditionForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.maxLength(2048)])
    });
  }

  updateErrorMessages() {
    const messages: { [key: string]: string | null } = {};

    Object.entries(this.medicalConditionForm.controls).forEach(([key, control]) => {
      if (control.hasError('required')) {
        messages[key] = `${this.getFieldName(key)} is required`;
      } else if (control.hasError('maxLength')) {
        const max = control.getError('maxLength')?.maxLength;
        messages[key] = `${this.getFieldName(key)} must be ${max} characters maximum`;
      } else {
        messages[key] = null;
      }
    });

    this.errorMessages.set(messages);
  }

  private getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      code: 'Code',
      designation: 'Designation',
      description: 'Description',
    };

    return fieldNames[field] || field;
  }

  tryCreate() {
    if (this.medicalConditionForm.valid) {
      const formData = this.medicalConditionForm.value;
      const createDto: MedicalConditionCreateDto = {
        code: formData.code,
        designation: formData.designation
      }

      if (formData.description !== "") {
        createDto.description = formData.description
      }

      this._service
        .create(createDto)
        .subscribe({
          next: (response) => {
            console.log('Medical condition created? ', response);

            this._router.navigate(['medicalCondition']);
          },
          error: (err) => {
            console.error('Medical condition create error:', err);
          },
        });
    } else {
      console.log("Invalid data!");
    }
  }
}
