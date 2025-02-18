import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../../../services/Allergy.service';
import { Allergy } from '../../../../domain/models/Allergy/Allergy';
import { AllergyUpdateDto } from '../../../../domain/models/Allergy/AllergyUpdateDto';

@Component({
  selector: 'app-update-allergy',
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
  templateUrl: './update-allergy.component.html',
  styleUrl: './update-allergy.component.scss'
})
export class UpdateAllergyComponent {
  public allergyId: string;
  public allergyForm: FormGroup;

  errorMessages = signal<{ [key: string]: string | null }>({});

  constructor(
    protected _router: Router,
    protected _service: AllergyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.allergyId = params['allergyId'];
    });

    this._service
      .getById(this.allergyId)
      .subscribe({
        next: (response) => {
          this.initForm(response);
        },
        error: (err) => {
          console.error('Allergy create error:', err);
        },
      });

    merge(
      ...Object.values(this.allergyForm.controls).map(control =>
        merge(control.statusChanges, control.valueChanges)
      )
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  private initForm(allergy: Allergy): void {
    this.allergyForm = new FormGroup({
      code: new FormControl(allergy.code, [Validators.required]),
      designation: new FormControl(allergy.designation, [Validators.required, Validators.maxLength(100)]),
      description: new FormControl(allergy.description, [Validators.maxLength(2048)])
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

  tryUpdate() {
    if (this.allergyForm.valid) {
      const formData = this.allergyForm.value;
      const updateDto: AllergyUpdateDto = {
        designation: formData.designation
      }

      if (formData.description !== "") {
        updateDto.description = formData.description
      }

      this._service
        .update(this.allergyId, updateDto)
        .subscribe({
          next: (response) => {
            console.log('Operation Type updated? ', response);

            this._router.navigate(['allergies']);
          },
          error: (err) => {
            console.error('Allergy update error:', err);
          },
        });
    } else {
      console.log("Invalid data!");
    }
  }
}
