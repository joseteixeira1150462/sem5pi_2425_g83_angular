import { Component } from '@angular/core';
import { OperationType } from '../../../domain/models/OperationType/OperationType.model';
import { OperationTypeService } from '../../../services/OperationType.service';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { OperationTypeMapper } from '../../../infrastructure/mappers/OperationType.mapper';
import { OperationTypeDto } from '../../../domain/models/OperationType/OperationTypeDto.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operation-type',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './operation-type.component.html',
  styleUrl: './operation-type.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OperationTypeComponent {
  operationTypeList: OperationTypeDto[] = [];
  errorMessage: string = '';

  columnsToDisplay = ['name', 'preparation', 'operation', 'cleaning'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand', 'delete'];
  expandedElement: OperationTypeDto | null;

  constructor(
    private _service: OperationTypeService,
    private _mapper: OperationTypeMapper
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this._service.search().subscribe({
      next: (data) => {
        this.operationTypeList = data
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  deleteRow(id: string) {
    this._service.delete(id).subscribe({
      next: () => {
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
