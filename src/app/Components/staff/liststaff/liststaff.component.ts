import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../../services/Staff/staff.service';
import { ListStaff } from '../../../../domain/models/Staff/ListStaff.model'; 
import { TimeSlotDto } from '../../../../domain/models/Staff/TimeSLot.model';  
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule,MatIconModule,],
  templateUrl: './liststaff.component.html',
  styleUrls: ['./liststaff.component.scss']
})

export class ListStaffComponent implements OnInit {
  staffList: ListStaff[] = [];
  

  constructor(
    private staffService: StaffService,
    private router: Router
  ) {
    console.log('StaffComponent: Construtor inicializado');
  }

  ngOnInit(): void {
    console.log('StaffComponent: ngOnInit executado');
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaffList().subscribe({
      next: (data) => {
        console.log('Dados recebidos (antes da transformação):', data);
  
        // Transformar os dados para corresponder ao modelo do frontend
        this.staffList = data.map((staff: any) => ({
          firstname: staff.firstName, 
          lastname: staff.lastName,  
          specialization: staff.specialization,
          phone: staff.phone,
          email: staff.staffEmail || 'N/A', // 
          licensenumber: staff.licenseNumber || 'N/A',
          avaibilityslots: staff.availabilitySlots?.map((slot: any) => ({
            start: slot.start, 
            end: slot.end
          })) || [] // Garante uma lista vazia
        }));
  
        console.log('Dados transformados (para o frontend):', this.staffList);
      },
      error: (err) => console.error('Erro ao buscar staff:', err)
    });
  }
  
  editStaff(staff: ListStaff): void {
    // Armazene os dados do staff no LocalStorage
    localStorage.setItem('staffToEdit', JSON.stringify(staff));
    // Redirecione para o formulário de edição
    this.router.navigate(['/staff/edit']);
  }

  deactivateStaff(staff: ListStaff): void {
    // Armazena apenas o license number no localStorage
    localStorage.setItem('staffToDeactivate', staff.licensenumber);
  
    // Navega para o componente de desativação
    this.router.navigate(['/staff/delete']);
  }
  
}
