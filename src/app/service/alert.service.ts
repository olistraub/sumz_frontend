import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AlertComponent } from '../alert/alert.component';


// maps message-type to an icon
enum Icon {
  INFO = 'info',
  SUCCESS = 'check_circle',
  WARN = 'warning',
  ERROR = 'error',
}


@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor(public snackBar: MatSnackBar) {} // public test: SnackbarComponent) { }

  private openSnackBar(icon: Icon, message: string) {
    this.snackBar.openFromComponent(AlertComponent, {
      data: {icon, message},
      duration: 5000,
    });
  }

  info(message: string) {
    this.openSnackBar(Icon.INFO, message);
  }

  success(message: string) {
    this.openSnackBar(Icon.SUCCESS, message);
  }

  warning(message: string) {
    this.openSnackBar(Icon.WARN, message);
  }

  error(message: string) {
    this.openSnackBar(Icon.ERROR, message);
  }
}
