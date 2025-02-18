import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestEditComponent } from './operation-request-edit.component';

describe('OperationRequestEditComponent', () => {
  let component: OperationRequestEditComponent;
  let fixture: ComponentFixture<OperationRequestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
