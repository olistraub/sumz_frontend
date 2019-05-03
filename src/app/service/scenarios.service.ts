import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { combineLatest, from, Observable, of, ReplaySubject, throwError, zip } from 'rxjs';
import { debounceTime, filter, flatMap, retry, switchMap } from 'rxjs/operators';
import { SumzAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { HttpClient } from './http-client';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  public scenarios$: Observable<Scenario[]>;
  protected _scenarios$: ReplaySubject<Scenario[]>;
  protected _scenariosStorage: Scenario[];

  constructor(@Inject(HttpClient) private _apiClient: TypedAxiosInstance<SumzAPI>) {
    this._scenarios$ = new ReplaySubject(1);
    this.scenarios$ = this._scenarios$.asObservable();

    this.getScenarios().subscribe();
  }

  getScenarios() {
    return from(this._apiClient.request({ url: '/scenarios' })).pipe(
      retry(2),
      flatMap(response => {
        this._scenariosStorage = response.data;
        this._scenarios$.next([...response.data]);
        return this.scenarios$;
      }));
  }

  getScenario(id$: Observable<number> | number) {
    // TODO: alle Verwendungen dieser Methode auf Observable<number> ändern
    if (typeof id$ === 'number') {
      id$ = of(id$);
    }

    return zip(
      id$,
      this.scenarios$,
    ).pipe(
      filter(([scenarioId, scenarios]) => !!scenarios),
      switchMap(([scenarioId, scenarios]) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (scenario) {
          return of(scenario);
        } else {
          return throwError(`Szenario ${scenarioId} existiert nicht`);
        }
      })
    );
  }

  addScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: '/scenarios',
      data: scenario,
      method: 'POST',
    })).pipe(
      retry(2),
      switchMap(response => this._forceGetScenario(response.data)),
      switchMap(addedScenario => {
        this._scenariosStorage.push(addedScenario);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(addedScenario);
      })
    );
  }

  updateScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: `/scenarios/${scenario.id}` as '/scenarios/:sId',
      method: 'PUT',
      data: scenario,
    })).pipe(
      retry(2),
      switchMap(response => this._forceGetScenario(response.data)),
      flatMap(updatedScenario => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenariosStorage.push(updatedScenario);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(updatedScenario);
      })
    );
  }

  removeScenario(scenario: Scenario) {
    return from(this._apiClient.delete(`/scenarios/${scenario.id}`)).pipe(
      retry(2),
      flatMap(() => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(scenario);
      }),
    );
  }

  private _forceGetScenario(id: number) {
    return from(this._apiClient.request({
      url: `/scenarios/${id}` as '/scenarios/:sId',
    })).pipe(
      retry(2),
      switchMap(response => of(response.data))
    );
  }
}
