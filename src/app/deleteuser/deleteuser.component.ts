import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-deleteuser',
  templateUrl: './deleteuser.component.html',
  styleUrls: ['./deleteuser.component.css'],
})

/**
 * Deleting an existing user account is implemented in this class.
 */
export class DeleteUserComponent implements OnInit {
  deleteFormGroup: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router) { }

  ngOnInit() {
    this.deleteFormGroup = this._formBuilder.group({
      // Validators to check the length of the password
      pwdCtrl: [''],
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.deleteFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    this._authenticationService.deleteUser(this.pwdCtrl.value.toString())
      .subscribe(
        () => {
          // if the delete was successful
          this._alertService.success('Ihr Account wurde erfolgreich gelöscht!');
          this._router.navigate(['/login']); // return to login page
        },
        (error) => {
          this._alertService.error(error.response.data.message || error);
          this.loading = false;
        },
        () => this.loading = false
      );
  }

  // getter for the password
  get pwdCtrl() { return this.deleteFormGroup.get('pwdCtrl'); }
}
