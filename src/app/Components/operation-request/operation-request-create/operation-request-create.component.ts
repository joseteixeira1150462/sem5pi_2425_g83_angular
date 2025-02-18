import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OperationRequestService } from '../../../../services/operation-request/operation-request.service';
import { OperationRequestDto } from '../../../../domain/models/OperationRequest/OperationRequesDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-operation-request-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './operation-request-create.component.html',
  styleUrl: './operation-request-create.component.scss'
})
export class OperationRequestCreateComponent {
  operationRequestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private operationRequestService: OperationRequestService,
    private datePipe: DatePipe
  ) {
      this.operationRequestForm = this.fb.group({
        PatientId: ['', Validators.required],
        DoctorId: ['', Validators.required],
        OperationTypeId: ['', Validators.required],
        OperationRequestPriority: ['', Validators.required],
        DeadlineDate: ['', Validators.required],
      });
  }
  onSubmit(): void {
    if (this.operationRequestForm.valid) {
      var operationRequest: OperationRequestDto = this.operationRequestForm.value;
      operationRequest.deadlineDate = operationRequest.deadlineDate + "T00:00:00";
      this.operationRequestService.createOperationRequest(operationRequest).subscribe({
        next: (response) => {
          console.log('Operation Request Created:', response);
          alert('Operation request successfully created.');
          this.operationRequestForm.reset();
        },
        error: (err) => {
          console.error('Error creating operation request:', err);
          alert('Failed to create operation request.');
        },
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
