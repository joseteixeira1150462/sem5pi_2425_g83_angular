import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestComponent } from './operation-request.component';

describe('OperationRequestComponent', () => {
  let component: OperationRequestComponent;
  let fixture: ComponentFixture<OperationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
