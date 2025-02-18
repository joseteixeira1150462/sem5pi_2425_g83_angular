import { Component } from '@angular/core';
import { Allergy } from '../../../domain/models/Allergy/Allergy';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AllergyService } from '../../../services/Allergy.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-allergy',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './allergy.component.html',
  styleUrl: './allergy.component.scss'
})
export class AllergyComponent {
  errorMessage: string;

  allergyList: Allergy[] = [];

  displayedColumns: string[] = ['code', 'designation', 'description', 'buttons'];
  dataSource = new MatTableDataSource(this.allergyList);

  constructor(
    private _service: AllergyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(searchTerm?: string): void {
    this._service.search(searchTerm).subscribe({
      next: (data) => {
        this.allergyList = data;
        this.dataSource.data = this.allergyList;
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.loadData(filterValue);

    this.dataSource.data = this.allergyList;
  }

  editRow(id: string) {
    this.router.navigate(['/allergies', id, 'update']);
  }
}
