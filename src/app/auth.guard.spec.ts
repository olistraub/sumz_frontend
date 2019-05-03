import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(
        [{path: '', component: AppComponent}, {path: 'login', component: LoginComponent}]),
        MaterialModule,
        ReactiveFormsModule,
      ],
      declarations: [
        AppComponent,
        LoginComponent,
      ],
      providers: [AuthGuard, RouterTestingModule],
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
