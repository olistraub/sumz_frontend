import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { from, Observable, ReplaySubject } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { SumzAPI } from '../api/api';
import { HttpClient } from './http-client';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public user$: Observable<Number>;
  protected _user$: ReplaySubject<Number>;

  constructor(
    @Inject(HttpClient) private _apiClient: TypedAxiosInstance<SumzAPI>,
  ) {
    // handle expired access_token
    this.addInterceptor();

    this._user$ = new ReplaySubject(1);
    this.user$ = this._user$.asObservable();
  }

  /**
   * signin a registered user
   * @param {string} email Email of the user
   * @param {string} password Password of the user
   * @returns {Observable<any>} Observable
   */
  login(email: string, password: string) {
    // convert data to x-www-form-urlencoded
    const data = new URLSearchParams();
    data.append('username', email);
    data.append('password', password);
    data.append('grant_type', 'password');

    return from(this._apiClient.request({
      url: '/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data,
      auth: { // -> Basic Authentication
        username: 'sumz1718AngularFrontend',
        password: 'XY7kmzoNzl100',
      },
      method: 'POST',
    }))
      .pipe(
        tap(response => {
          this.logout();
          // store user details in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this._user$.next();
        }),
    );
  }

  /**
   * refresh the tokens for authenticated server communicaiton
   * @returns {Observable<any>} Observable
   */
  refresh() {
    // convert data in x-www-form-urlencoded
    const data = new URLSearchParams();
    data.append('refresh_token', JSON.parse(localStorage.getItem('currentUser')).refresh_token);
    data.append('grant_type', 'refresh_token');

    return from(this._apiClient.request({
      url: '/oauth/token',
      headers: { '_isRetry': true },
      data: data,
      auth: { // -> Basic Authentication
        username: 'sumz1718AngularFrontend',
        password: 'XY7kmzoNzl100',
      },
      method: 'POST',
    }))
      .pipe(
        tap(response => {
          // delete old tokens
          this.logout();
          // store new user details in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this._user$.next();
        })
      );
  }

  /**
   * register a new user
   * (is called in registration.component)
   * @param {string} email Email
   * @param {string} password Password
   * @returns {Observable<any>} Observable
   */
  register(email: string, password: string) {
    return from(this._apiClient.request({
      url: '/users',
      data: { email, password },
      method: 'POST',
    }))
      .pipe(
        tap(() => {
          this._user$.next();
        })
      );
  }

  /**
   * changes the password
   * (is called in changepassword.component)
   * @param {string} oldPassword actual password
   * @param {string} newPassword new password
   * @returns {Observable<any>} Observable
   */
  changePassword(oldPassword: string, newPassword: string) {
    return from(this._apiClient.put(`/users/${JSON.parse(localStorage.getItem('currentUser')).user_id}`,
      { 'oldPassword': oldPassword, 'newPassword': newPassword }))
      .pipe(
        tap(() => {
          this.logout();
          this._user$.next();
        })
      );
  }

  /**
   * send a request to reset the current password
   * (is called in newpasswordemail.component.ts)
   * @param {string} email Email
   * @returns {Observable<any>} Observable
   */
  resetPassword(email: string) {
    return from(this._apiClient.request({
      url: '/users/forgot',
      data: { email },
      method: 'POST',
    }))
      .pipe(
        tap(() => {
          this._user$.next();
        })
      );
  }

  /**
   * deletes an existing user
   * @param {string} password password of the user account
   * @returns {Ovservable<any>} Observable
   */
  deleteUser(password: string) {
    return from(this._apiClient.post(`/users/${JSON.parse(localStorage.getItem('currentUser')).user_id}/delete`, { 'password': password }))
      .pipe(
        tap(() => {
          this.logout();
          this._user$.next();
        })
      );
  }

  /**
   * sends the new password after the reset
   * @param {string} token user token from mail
   * @param {string} password new password
   * @returns {Observable<any>} Observable
   */
  postNewPassword(token: string, password: string) {
    return from(this._apiClient.post(`/users/reset/${token}`, { 'password': password }))
      .pipe(
        tap(() => {
          this.logout();
          this._user$.next();
        })
      );
  }

  /**
   * removes user from local storage to log user out
   * @returns {void}
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  /**
   * Intercepts a response and refreshes access_token.
   * Afterwards, the http-request is executed with the new access_token.
   * @returns {void}
   */
  private addInterceptor() {
    this._apiClient.interceptors.response.use(response => {
      return response;
    },
      error => {
        if (error.message === 'Network Error' ||
          (!!error.response
            && error.response.status === 401
            && !error.response.config.headers._isRetry)
          && localStorage.getItem('currentUser')) {

          // get new access_token
          const newResponse = this.refresh()
            .pipe(
              switchMap(({ data }) => {
                // update Authorization header in primary request
                error.config.headers.Authorization = data.token_type
                  + ' '
                  + data.access_token;
                error.config.headers._isRetry = true;

                // return the response using a new access_token
                return this._apiClient.request(error.config);
              })
            ).toPromise();
          return newResponse;
        }
        return Promise.reject(error);
      });
  }

  /**
   * Shows wether a user is logged in
   * @returns {Boolean} true, if user is logged in
   */
  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
