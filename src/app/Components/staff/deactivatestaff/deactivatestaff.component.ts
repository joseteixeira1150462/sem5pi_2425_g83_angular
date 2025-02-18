import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService } from '../../../../services/Staff/staff.service'; 

@Component({
  selector: 'app-deactivatestaff',
  standalone: true,
  imports: [],
  templateUrl: './deactivatestaff.component.html',
  styleUrl: './deactivatestaff.component.scss'
})
export class DeactivateStaffComponent implements OnInit {
  licenseNumber: string = '';

  constructor(private staffService: StaffService, private router: Router) {}

  ngOnInit(): void {
    // Recupera o licenseNumber do localStorage
    const license = localStorage.getItem('staffToDeactivate');
    if (license) {
      this.licenseNumber = license;
    } else {
      console.error('Número de licença não encontrado!');
      this.router.navigate(['/staff/list']); // Volta para a listagem
    }
  }

  // Método chamado ao clicar no botão de confirmar
  onSubmit(): void {
    if (!this.licenseNumber) {
      console.error('Número de licença não definido!');
      return;
    }

    // Chama o serviço para desativar o staff
    this.staffService.deactivateStaff(this.licenseNumber).subscribe({
      next: () => {
        alert('Staff desativado com sucesso!');
        this.router.navigate(['/staff/list']); // Redireciona para a listagem
      },
      error: (err) => {
        console.error('Erro ao desativar staff:', err);
        alert('Erro ao desativar staff. Tente novamente.');
      },
    });
  }

  // Método chamado ao clicar no botão de cancelar
  cancel(): void {
    this.router.navigate(['/staff/list']); // Redireciona para a listagem
  }
}
