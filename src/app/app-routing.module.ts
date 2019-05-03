import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { NewPasswordEmailComponent } from './newpasswordemail/newpasswordemail.component';
import { DeleteUserComponent } from './deleteuser/deleteuser.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { CreditsComponent } from './credits/credits.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: ScenariosComponent, data: { state: 'scenarios' }, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, data: { state: 'login' } },
  { path: 'registration', component: RegistrationComponent, data: { state: 'registration' } },
  { path: 'changepassword', component: ChangePasswordComponent, data: { state: 'changepassword' }, canActivate: [AuthGuard] },
  { path: 'newpasswordemail', component: NewPasswordEmailComponent, data: { state: 'forgot' } },
  { path: 'users/reset/:token', component: NewPasswordComponent, data: { state: 'reset' } },
  { path: 'users/delete', component: DeleteUserComponent, data: { state: 'delete' }, canActivate: [AuthGuard] },
  { path: 'create', component: CreateScenarioComponent, data: { state: 'create' }, canActivate: [AuthGuard] },
  { path: 'scenario/:id', component: ScenarioDetailComponent, data: { state: 'details' }, canActivate: [AuthGuard] },
  { path: 'credits', component: CreditsComponent, data: { state: 'credits' } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
