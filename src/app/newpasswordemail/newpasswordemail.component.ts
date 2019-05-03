import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-newpasswordemail',
  templateUrl: './newpasswordemail.component.html',
  styleUrls: ['./newpasswordemail.component.css'],
})

/**
 * Changing the password of an existing user account is implemented in this class.
 */
export class NewPasswordEmailComponent implements OnInit {
  newFormGroup: FormGroup;
  loading = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router) { }

  ngOnInit() {
    this.newFormGroup = this._formBuilder.group({
      // Validators to check the length of the passwords
      mailCtrl: ['', Validators.email],
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.newFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    // call the method to request a new password
    this._authenticationService.resetPassword(this.mailCtrl.value.toString())
      .subscribe(
        () => {
          this._alertService.success('Ein Link zum Zurücksetzen des Passworts wurde an die angegebene Mailadresse versendet');
          this._router.navigate(['/login']);
        },
        (error) => {
          this._alertService.error(error.response.data.error_description || error);
          this.loading = false;
        },
        () => this.loading = false
      );
  }

  // getter for the email, old and new passwords
  get mailCtrl() { return this.newFormGroup.get('mailCtrl'); }
}
