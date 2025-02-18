import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../../../services/Allergy.service';
import { AllergyCreateDto } from '../../../../domain/models/Allergy/AllergyCreateDto';

@Component({
  selector: 'app-create-allergy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './create-allergy.component.html',
  styleUrl: './create-allergy.component.scss'
})
export class CreateAllergyComponent {
  public allergyForm: FormGroup;

  errorMessages = signal<{ [key: string]: string | null }>({});

  constructor(
    protected _router: Router,
    protected _service: AllergyService
  ) {
    this.initForm();

    merge(
      ...Object.values(this.allergyForm.controls).map(control =>
        merge(control.statusChanges, control.valueChanges)
      )
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  private initForm(): void {
    this.allergyForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.maxLength(2048)])
    });
  }

  updateErrorMessages() {
    const messages: { [key: string]: string | null } = {};

    Object.entries(this.allergyForm.controls).forEach(([key, control]) => {
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
    if (this.allergyForm.valid) {
      const formData = this.allergyForm.value;
      const createDto: AllergyCreateDto = {
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
            console.log('Operation Type created? ', response);

            this._router.navigate(['allergies']);
          },
          error: (err) => {
            console.error('Allergy create error:', err);
          },
        });
    } else {
      console.log("Invalid data!");
    }
  }
}
