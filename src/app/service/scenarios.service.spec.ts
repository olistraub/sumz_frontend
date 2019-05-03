import { inject, TestBed } from '@angular/core/testing';
import MockAdapter from 'axios-mock-adapter';
import axios from 'restyped-axios';
import { flatMap, skip } from 'rxjs/operators';
import { SumzAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { HttpClient } from './http-client';
import { ScenariosService } from './scenarios.service';

let mockAdapter: MockAdapter;
const mockData = [{ id: 2500 }, { id: 2501 }, { id: 2502 }, { id: 2510 }] as Scenario[];

describe('ScenariosService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [ScenariosService, {
        provide: HttpClient,
        useFactory: () => {
          const axiosInstance = axios.create<SumzAPI>();
          mockAdapter = new MockAdapter(axiosInstance)
            .onGet('/scenarios').reply(config => {
              return [200, [...mockData]];
            })
            .onDelete('/scenarios/2510').reply(config => {
              return [200];
            })
            .onPost('/scenarios').reply(config => {
              const receivedScenario: Scenario = JSON.parse(config.data);
              mockData.push(receivedScenario);
              return [200, receivedScenario.id];
            })
            .onGet(/\/scenarios\/[0-9]+/).reply(config => {
              const requestedId = +config.url.split('/').reverse()[0];
              return [200, mockData.find(s => s.id === requestedId)];
            });
          return axiosInstance;
        },
      }],
    });
  });

  it('should be created', inject([ScenariosService], (service: ScenariosService) => {
    expect(service).toBeTruthy();
  }));

  /* Wichtig zu wissen: alle nachfolgenden Tests gehen davon aus, dass die Methoden des Services entweder
  ** einen Wert zurückgeben (Observer.next) oder einen Fehler werfen (Observer.error).
  ** Wenn sie ohne einen Wert zurückzugeben beendet werden oder nie enden, wird überhaupt keine Assertion
  ** ausgeführt. Das ist zwar äußerst unwahrscheinlich, aber es wäre ggf. sinnvoll, einen Spy einzusetzen,
  ** um sicherzugehen, dass tatsächlich next/error aufgerufen werden.
  */

  it('should return a list of scenarios', inject([ScenariosService], (service: ScenariosService) => {
    service.getScenarios().subscribe(
      scenarios => expect(scenarios.length).toBe(4),
      fail);
  }));

  it('should return a single scenario', inject([ScenariosService], (service: ScenariosService) => {
    service.getScenario(2500).subscribe(
      scenario => expect(scenario.id).toBe(2500),
      fail);
  }));

  it('should throw an error when trying to get a non-existing scenario', inject([ScenariosService],
    (service: ScenariosService) => {
      service.getScenario(-1).subscribe(
        success => fail('was not supposed to return something'),
        error => expect().nothing());
    }));

  it('should be able to delete a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const deleteThis = { id: 2510 } as Scenario;
    service
      .removeScenario(deleteThis)
      .pipe(flatMap(() => service.scenarios$), skip(1))
      .subscribe(
        scenarios => {
          expect(scenarios).not.toContain(deleteThis, 'should have deleted the entry');
          expect(scenarios.length).toBe(3, 'should not have deleted other entries');
        },
        fail);
  }));

  it('should be able to modify a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const modifyThis = { id: 2500, scenarioDescription: 'A new description' } as Scenario;

    let received: Scenario;
    mockAdapter
      .onPut('/scenarios/2500').reply(config => {
        const updateScenario = JSON.parse(config.data);
        updateScenario.id = 2500;
        mockData[mockData.findIndex(s => s.id === updateScenario.id)] = updateScenario;
        received = updateScenario;
        return [200, 2500];
      })
      .onGet('/scenarios/2500').reply(config => {
        return [200, received];
      });

    service
      .updateScenario(modifyThis)
      .subscribe(
        modifiedScenario => {
          expect(modifiedScenario).toEqual(modifyThis, 'Should have returned the modified scenario');
          service.scenarios$.subscribe(
            allScenarios => expect(allScenarios).toContain(modifyThis, 'The list of scenarios should have contained the modified scenario'),
            fail
          );
        },
        fail
      );

  }));

  it('should be able to add a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const addThis = { id: 9999 } as Scenario;

    service.addScenario(addThis).subscribe(
      addedScenario => {
        expect(addedScenario).toEqual(addThis);
        service.scenarios$.subscribe(
          scenarios => expect(scenarios).toContain(addThis),
          fail);
      },
      fail);
  }));
});
