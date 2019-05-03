import { TestBed, inject } from '@angular/core/testing';
import MockAdapter from 'axios-mock-adapter';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from './http-client';
import { SumzAPI } from '../api/api';
import { RouterTestingModule } from '@angular/router/testing';


describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthenticationService, {
        provide: HttpClient,
        useFactory: () => {
          const axiosInstance = axios.create<SumzAPI>();
          const user = JSON.stringify({
            access_token: '214vg3hg2v123f123f4ghv',
            refresh_token: 'dfshbfhb367gfvagfasf',
            token_type: 'bearer',
            expires_in: 1234,
            scope: 'read write',
            jti: '',
            id: 1,
          }) as String;
          new MockAdapter(axiosInstance)
          .onPost('/oauth/token').reply( config => {
            if (config.params.grant_type === 'password' && config.params.email === 'test@test.de' && config.params.password === 'pass') {
              return [200, ...user];
            }
            if (config.params.grant_type === 'refresh_token' && config.params.refresh_token === 'dfshbfhb367gfvagfasf') {
              return [200, ...user];
            }
          });
          return axiosInstance;
        },
      }],
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  // // should be async
  // xit('#login should return credentials'), inject([AuthenticationService], (service: AuthenticationService) => {
  //   service.login('test@test.de', 'pass').
  //   then( () => {
  //     expect(JSON.parse(localStorage.getItem('currentUser')).access_token).toBe('dfshbfhb367gfvagfasf');
  //   })
  //   .catch(fail);
  // });

  // TODO: Tests für folgende Methoden können noch umgesetzt werden:
  // #refresh #registration #changepassword #newpassword #logout #addinterceptor
});
