import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

/**
 * Functionality to login a known user
 */
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    // checks if url call was from mail confirmation link
    this._route.queryParams.subscribe(
      param => {
        // debugger;
        if (Object.keys(param).includes('useractivated')) {
          this._alertService.success('Benutzeraccount erfolgreich aktiviert!');
        }
      }
    );
  }

  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      mailCtrl: ['', Validators.email],
      pwdCtrl: '',
    });
  }

  onSubmit() {
    // abort if form is invalid
    if (this.loginFormGroup.invalid) {
      return;
    }

    // disable login button
    this.loading = true;

    this._authenticationService.login(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .subscribe(
        () => {
          // navigate to return url from route parameters or default to '/'
          this._router.navigate([this._route.snapshot.queryParams['returnUrl'] || '/']);
        },
        (error) => {
          if (error.response.data.error_description === 'Bad credentials') {
            this._alertService.error('Authentifizierungsfehler: Benutzername oder Password falsch');
          } else {
            this._alertService.error(error.response.data.error_description || error);
          }
          this.loading = false;
        },
        () => this.loading = false
      );
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
