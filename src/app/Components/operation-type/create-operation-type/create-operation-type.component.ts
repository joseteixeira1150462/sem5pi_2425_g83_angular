import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { OperationTypeService } from '../../../../services/OperationType.service';
import { OperationTypeCreateDto } from '../../../../domain/models/OperationType/OperationTypeCreateDto.model';

@Component({
    selector: 'app-create-operation-type',
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
    templateUrl: './create-operation-type.component.html',
    styleUrl: './create-operation-type.component.scss'
})
export class CreateOperationTypeComponent {
    public operationTypeForm: FormGroup;

    rolesList = ['Doctor', 'Nurse', 'Technician'];
    specializationsList = ['Anaesthetist', 'Instrumenting', 'Circulating', 'MedicalActionAssistant', 'Orthopaedist', 'XrayTechnician'];

    errorMessages = signal<{ [key: string]: string | null }>({});

    constructor(
        protected _router: Router,
        protected _service: OperationTypeService
    ) {
        this.initForm();

        merge(
            ...Object.values(this.operationTypeForm.controls).map(control =>
                merge(control.statusChanges, control.valueChanges)
            )
        )
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.updateErrorMessages());
    }

    private initForm(): void {
        this.operationTypeForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            preparation: new FormControl(null, [Validators.required, Validators.min(1)]),
            operation: new FormControl(null, [Validators.required, Validators.min(1)]),
            cleaning: new FormControl(null, [Validators.required, Validators.min(1)]),
            specializations: new FormArray([
                new FormGroup({
                    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
                    role: new FormControl(this.rolesList[0], [Validators.required]),
                    specialization: new FormControl(this.specializationsList[0], [Validators.required])
                })
            ])
        });
    }

    get specializations(): FormArray {
        return this.operationTypeForm.get('specializations') as FormArray;
    }

    addSpecialization(): void {
        const newSpecialization = new FormGroup({
            quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
            role: new FormControl('', [Validators.required]),
            specialization: new FormControl('', [Validators.required])
        });

        this.specializations.push(newSpecialization);
    }

    removeSpecialization(index: number): void {
        if (this.specializations.length > 1) {
            this.specializations.removeAt(index);
        }
    }

    updateErrorMessages() {
        const messages: { [key: string]: string | null } = {};

        Object.entries(this.operationTypeForm.controls).forEach(([key, control]) => {
            if (control instanceof FormArray) {
                control.controls.forEach((group, i) => {
                    const groupErrors = (group as FormGroup).controls;
                    Object.keys(groupErrors).forEach(fieldKey => {
                        const fieldControl = groupErrors[fieldKey];
                        if (fieldControl.hasError('required')) {
                            messages[`dynamicFields[${i}].${fieldKey}`] = `${this.getFieldName(fieldKey)} is required`;
                        } else if (fieldControl.hasError('min')) {
                            const minimum = fieldControl.getError('min')?.min;
                            messages[`dynamicFields[${i}].${fieldKey}`] = `${this.getFieldName(fieldKey)} must be at least ${minimum}`;
                        }
                    });
                });
            }
            if (control.hasError('required')) {
                messages[key] = `${this.getFieldName(key)} is required`;
            } else if (control.hasError('min')) {
                const minimum = control.getError('min')?.min;
                messages[key] = `${this.getFieldName(key)} must be at least ${minimum}`;
            } else {
                messages[key] = null;
            }
        });

        this.errorMessages.set(messages);
    }

    private getFieldName(field: string): string {
        const fieldNames: { [key: string]: string } = {
            name: 'Name',
            preparation: 'Preparation',
            operation: 'Operation',
            cleaning: 'Cleaning',
            quantity: 'Quantity',
            role: 'Role',
            specialization: 'Specialization'
        };

        return fieldNames[field] || field;
    }

    tryCreate() {
        if (this.operationTypeForm.valid) {
            const formData = this.operationTypeForm.value;
            const createDto: OperationTypeCreateDto = {
                name: formData.name,
                preparation: formData.preparation,
                operation: formData.operation,
                cleaning: formData.cleaning,
                specializations: formData.specializations
            }

            this._service
                .create(createDto)
                .subscribe({
                    next: (response) => {
                        console.log('Operation Type created? ', response);

                        this._router.navigate(['operationType']);
                    },
                    error: (err) => {
                        //this.loginFailed = true;
                        console.error('Operation Type create error:', err);
                    },
                });
        } else {
            console.log("Invalid data!");
        }
    }
}
