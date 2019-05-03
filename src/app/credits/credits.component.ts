import { Component, OnInit } from '@angular/core';
import { licenses } from './licenses';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css'],
})
export class CreditsComponent implements OnInit {

  dependencies =
    licenses
      .filter(dependency =>
        (dependency.summary.includes('MIT') ||
          dependency.summary.includes('Apache')) &&
        dependency.name !== 'sumz')
      .map(dependency => {
        return {
          name: dependency.name,
          license: dependency.summary,
          repoUrl: dependency.repository,
          licenseText$: this._http.get(
            dependency.repository.replace('://github.com', '://raw.githubusercontent.com')
            + '/master/LICENSE',
            { responseType: 'text' }
          ).pipe(
            // tslint:disable-next-line:handle-callback-err
            catchError((err, caught) => this._http.get(
              dependency.repository.replace('://github.com', '://raw.githubusercontent.com')
              + '/master/LICENSE.txt',
              { responseType: 'text' }
            ))).pipe(
              catchError(() => of('Kein Lizenztext gefunden')),
          ),
        };
      });

  constructor(private _http: HttpClient) { }

  ngOnInit() { }
}
