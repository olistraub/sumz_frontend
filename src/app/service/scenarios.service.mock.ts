import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { DEFAULT_MOCK_DATA } from './mockdata';
import { ScenariosService } from './scenarios.service';

@Injectable()
export class ScenariosServiceMock extends ScenariosService {
    protected _scenariosStorage: Scenario[] = DEFAULT_MOCK_DATA;

    constructor() {
        super(null);
        this._scenarios$.next(this._scenariosStorage);
    }

    getScenarios() {
        return this.scenarios$;
    }

    getScenario(id: number) {
        return this.scenarios$.pipe(
            switchMap(scenarios => of(scenarios.find(s => s.id === id))),
        );
    }

    addScenario(scenario: Scenario) {
        this._scenariosStorage.push(scenario);
        this._scenarios$.next(this._scenariosStorage);
        return of(scenario);
    }

    updateScenario(scenario: Scenario) {
        return of(scenario);
    }
}
