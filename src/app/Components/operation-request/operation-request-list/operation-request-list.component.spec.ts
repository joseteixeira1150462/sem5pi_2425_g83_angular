import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestListComponent } from './operation-request-list.component';

describe('OperationRequestListComponent', () => {
  let component: OperationRequestListComponent;
  let fixture: ComponentFixture<OperationRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
