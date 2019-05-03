import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationComponent } from '../registration/registration.component';
import { ChangePasswordComponent } from '../changepassword/changepassword.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, RegistrationComponent, ChangePasswordComponent],
      imports: [MaterialModule, ReactiveFormsModule, BrowserAnimationsModule, RouterTestingModule.withRoutes(
        [{ path: 'registration', component: RegistrationComponent },
        { path: 'resetpassword', component: ChangePasswordComponent }]
      )],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
