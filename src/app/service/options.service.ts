import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { map, switchMapTo, tap } from 'rxjs/operators';
import { RemoteConfig, ScenarioConfig } from '../api/config';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  public config$: Observable<RemoteConfig>;
  private _config$: ReplaySubject<RemoteConfig>;
  private _remoteConfig: RemoteConfig;

  constructor() {
    this._config$ = new ReplaySubject(1);
    this.config$ = this._config$.asObservable();
  }

  getConfig() {
    this._remoteConfig = this._remoteConfig
      || JSON.parse(localStorage.getItem('remoteConfig'))
      || { scenarioConfig: new Map<number, ScenarioConfig>() };
    // TODO: Make Backend request here
    return of(this._remoteConfig).pipe(
      tap(remoteConfig => this._config$.next(remoteConfig)),
      switchMapTo(this.config$),
    );
  }

  setConfig(modifiedConfig: RemoteConfig) {
    // TODO: Make Backend request here
    return of({ data: modifiedConfig }).pipe(
      map(response => response.data),
      tap(remoteConfig => {
        this._remoteConfig = remoteConfig;
        localStorage.setItem('remoteConfig', JSON.stringify(remoteConfig));
        this._config$.next({ ...remoteConfig });
      }),
      switchMapTo(this.config$),
    );
  }
}
