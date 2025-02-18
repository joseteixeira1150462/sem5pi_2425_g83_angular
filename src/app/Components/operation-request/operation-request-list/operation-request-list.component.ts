import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OperationRequestService } from '../../../../services/operation-request/operation-request.service';
import { OperationRequestDto } from '../../../../domain/models/OperationRequest/OperationRequesDto';
import { StaffRepository } from '../../../../infrastructure/repositories/Staff.repository';
import { OperationTypeRepository } from '../../../../infrastructure/repositories/OperationType.repository';

@Component({
  selector: 'app-operation-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './operation-request-list.component.html',
  styleUrl: './operation-request-list.component.scss'
})
export class OperationRequestListComponent {

  operationRequests: OperationRequestDto[] = [];
  
    constructor(
      private operationRequestService: OperationRequestService,
      private staffRepository: StaffRepository,
      private operationRepository: OperationTypeRepository,
    ) {
    }
  
    ngOnInit(): void {
      this.refreshList();
    }

    refreshList(): void {
      this.operationRequests =  [];
      this.operationRequestService.getAllOperationRequests().subscribe(data => {
        this.operationRequests = data;
      });
      this.operationRequests.forEach(request => {
        this.staffRepository.getStaffById(request.patientId).subscribe(doctor => {
          request.doctorName = doctor.fullName
        }),
        this.operationRepository.getOperationTypeById(request.operationTypeId).subscribe(operationType => {
          request.operationName = operationType.name
        })
      })
    }
    
}
