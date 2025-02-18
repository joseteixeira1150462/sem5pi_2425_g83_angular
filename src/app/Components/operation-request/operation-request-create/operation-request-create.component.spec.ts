import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestCreateComponent } from './operation-request-create.component';

describe('OperationRequestCreateComponent', () => {
  let component: OperationRequestCreateComponent;
  let fixture: ComponentFixture<OperationRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
