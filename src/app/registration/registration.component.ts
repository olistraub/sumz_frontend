import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

/**
 * The registration of new users is implemented in this component
 */
export class RegistrationComponent implements OnInit {

  registerFormGroup: FormGroup;
  hidePw1 = true;
  hidePw2 = true;
  loading = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router) { }

  ngOnInit() {
    this.registerFormGroup = this._formBuilder.group({
      // Validators to check the inputs
      // Note: Backend uses same validators
      mailCtrl: ['', Validators.email],
      pwdCtrl: ['', [
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).*')]],
      pwdrptCtrl: [''],
    }, {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdCtrl', 'pwdrptCtrl'),
      });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    this._authenticationService.register(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .subscribe(
        () => {
          // if the registration was successful inform them to check their mails and activate their account
          this._alertService.success('Die Registrierung war erfolgreich! ' +
            'Ein Link zur Aktivierung Ihres Profils wurde an die von Ihnen angegebene Email-Adresse versandt.');
          this._router.navigate(['/login']);
        },
        (error) => {
          this._alertService.error(error.response.data.message || error);
          this.loading = false;
        },
        () => this.loading = false
      );
  }

  // getter for the email-adress and the two passwords to check if they match
  get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

  get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }

}
