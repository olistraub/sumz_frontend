import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { Scenario } from '../api/scenario';
import { ScenariosService } from '../service/scenarios.service';

@Component({
  selector: 'app-select-scenario',
  templateUrl: './select-scenario.component.html',
  styleUrls: ['./select-scenario.component.css'],
})
export class SelectScenarioComponent implements OnInit {
  scenarios$ = this._scenariosService.scenarios$;

  constructor(private bottomSheetRef: MatBottomSheetRef<SelectScenarioComponent>, private _scenariosService: ScenariosService) { }

  ngOnInit() {
  }

  selectScenario(scenario: Scenario) {
    this.bottomSheetRef.dismiss(scenario);
  }

}
