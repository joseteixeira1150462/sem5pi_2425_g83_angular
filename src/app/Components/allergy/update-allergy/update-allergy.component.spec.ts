import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAllergyComponent } from './update-allergy.component';

describe('UpdateAllergyComponent', () => {
  let component: UpdateAllergyComponent;
  let fixture: ComponentFixture<UpdateAllergyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAllergyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAllergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
