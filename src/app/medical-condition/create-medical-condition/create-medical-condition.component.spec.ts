import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalConditionComponent } from './create-medical-condition.component';

describe('CreateMedicalConditionComponent', () => {
  let component: CreateMedicalConditionComponent;
  let fixture: ComponentFixture<CreateMedicalConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicalConditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicalConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
