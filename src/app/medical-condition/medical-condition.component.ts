import { Component } from '@angular/core';
import { MedicalCondition } from '../../domain/models/MedicalCondition/MedicalCondition';
import { MedicalConditionService } from '../../services/MedicalCondition.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-medical-condition',
  standalone: true,
  imports: [
      RouterModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule],
  templateUrl: './medical-condition.component.html',
  styleUrl: './medical-condition.component.scss'
})
export class MedicalConditionComponent {
errorMessage: string;

  list: MedicalCondition[] = [];

  displayedColumns: string[] = ['code', 'designation', 'description'];
  dataSource = new MatTableDataSource(this.list);

  constructor(
    private _service: MedicalConditionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(searchTerm?: string): void {
    this._service.search(searchTerm).subscribe({
      next: (data) => {
        this.list = data;
        this.dataSource.data = this.list;
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.loadData(filterValue);

    this.dataSource.data = this.list;
  }
}
