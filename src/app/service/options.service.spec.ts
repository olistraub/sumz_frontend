import { TestBed, inject } from '@angular/core/testing';

import { OptionsService } from './options.service';
import { RemoteConfig, ScenarioConfig } from '../api/config';
import { skip } from 'rxjs/operators';

describe('OptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptionsService],
    });
  });

  it('should be created', inject([OptionsService], (service: OptionsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return the remote configuration', inject([OptionsService], (service: OptionsService) => {
    service.getConfig().subscribe(config => {
      expect(config).toBeTruthy();
      expect(config.scenarioConfig).toBeDefined();
    }, fail);
  }));

  it('should modify the remote configuration', inject([OptionsService], (service: OptionsService) => {
    const newConfig: RemoteConfig = {
      scenarioConfig: new Map<number, ScenarioConfig>([
        [1, { showResult: { apv: true, cvd: true, fcf: false, fte: false } }]]),
    };
    service.getConfig().subscribe();
    service.setConfig(newConfig).subscribe(updatedConfig => {
      expect(updatedConfig).toEqual(newConfig);
    }, fail);
  }));
});
