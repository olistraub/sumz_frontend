
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular-highcharts';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { AccountingDataComponent } from './accounting-data/accounting-data.component';
import { AlertComponent } from './alert/alert.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { CreditsComponent } from './credits/credits.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { NewPasswordEmailComponent } from './newpasswordemail/newpasswordemail.component';
import { DeleteUserComponent } from './deleteuser/deleteuser.component';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { SelectScenarioComponent } from './select-scenario/select-scenario.component';
import { ScenariosService } from './service/scenarios.service';
import { ScenariosServiceMock } from './service/scenarios.service.mock';
import { ToDoubleDirective } from './to-double.directive';
import { HttpClientModule } from '@angular/common/http';
import { ExportScenarioComponent } from './export-scenario/export-scenario.component';
import { ImportScenarioComponent } from './import-scenario/import-scenario.component';

@NgModule({
  declarations: [
    AppComponent,
    ScenariosComponent,
    ScenarioDetailComponent,
    ToDoubleDirective,
    SelectScenarioComponent,
    ScenarioCardComponent,
    DeleteDialogComponent,
    LoginComponent,
    RegistrationComponent,
    AccountingDataComponent,
    CreateScenarioComponent,
    ChangePasswordComponent,
    NewPasswordComponent,
    NewPasswordEmailComponent,
    DeleteUserComponent,
    AlertComponent,
    CreditsComponent,
    ExportScenarioComponent,
    ImportScenarioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartModule,
    HttpClientModule,
  ],
  providers: [
    environment.emergencyDemo
      ? { provide: ScenariosService, useClass: ScenariosServiceMock }
      : ScenariosService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [SelectScenarioComponent, DeleteDialogComponent, AlertComponent, ExportScenarioComponent, ImportScenarioComponent],
})
export class AppModule { }
