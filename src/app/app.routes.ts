import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './Guards/Auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OperationRequestComponent } from './Components/operation-request/operation-request.component';
import { OperationRequestListComponent } from './Components/operation-request/operation-request-list/operation-request-list.component';
import { OperationRequestCreateComponent } from './Components/operation-request/operation-request-create/operation-request-create.component';
import { OperationRequestEditComponent } from './Components/operation-request/operation-request-edit/operation-request-edit.component';
import { ListStaffComponent } from './Components/staff/liststaff/liststaff.component';
import { ListPatientComponent } from './Components/patient/list-patient/list-patients-profiles.component';
import { CreateStaffComponent } from './Components/staff/createstaff/createstaff.component';
import { CreatePatientComponent } from './Components/patient/create-patient/create-patient.component';
import { EditPatientComponent } from './Components/patient/edit-patient/edit-patient.component';
import { OperationTypeComponent } from './Components/operation-type/operation-type.component';
import { EditStaffComponent } from './Components/staff/editstaff/editstaff.component';
import { DeactivateStaffComponent } from './Components/staff/deactivatestaff/deactivatestaff.component';
import { CreateOperationTypeComponent } from './Components/operation-type/create-operation-type/create-operation-type.component';
import { AllergyComponent } from './Components/allergy/allergy.component';
import { CreateAllergyComponent } from './Components/allergy/create-allergy/create-allergy.component';
import { UpdateAllergyComponent } from './Components/allergy/update-allergy/update-allergy.component';
import { MedicalConditionComponent } from './medical-condition/medical-condition.component';
import { CreateMedicalConditionComponent } from './medical-condition/create-medical-condition/create-medical-condition.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'staff/list', component: ListStaffComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'staff/create', component: CreateStaffComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'staff/edit', component: EditStaffComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'staff/delete', component: DeactivateStaffComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'operationType', component: OperationTypeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'patient/create', component: CreatePatientComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'patient/edit', component: EditPatientComponent, canActivate: [AuthGuard], data: { roles: ['Admin','Patient'] } },
      { path: 'patient/list', component: ListPatientComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'operationType/create', component: CreateOperationTypeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'patient/edit', component: EditPatientComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Patient'] } },
      { path: 'operationType/create', component: CreateOperationTypeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'allergies', component: AllergyComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'allergies/create', component: CreateAllergyComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'allergies/:allergyId/update', component: UpdateAllergyComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'medicalCondition', component: MedicalConditionComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'medicalCondition/create', component: CreateMedicalConditionComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } }
    ]
  },
  {
    path: 'operation-request', component: OperationRequestComponent,
    children: [
      { path: 'list', component: OperationRequestListComponent },
      { path: 'create', component: OperationRequestCreateComponent },
      { path: 'edit', component: OperationRequestEditComponent },
    ]
  },
  { path: '**', redirectTo: 'login' },
];
@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule { }