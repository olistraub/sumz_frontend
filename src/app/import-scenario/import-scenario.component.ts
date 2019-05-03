import { Component, OnInit } from '@angular/core';
import { Scenario } from '../api/scenario';
import { environmentParams, accountingDataParams } from '../api/paramData';
import { AlertService } from '../service/alert.service';
import { ScenariosService } from '../service/scenarios.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-import-scenario',
  templateUrl: './import-scenario.component.html',
  styleUrls: ['./import-scenario.component.css'],
})
export class ImportScenarioComponent implements OnInit {
  private _fileReader = new FileReader();
  scenario: Scenario;
  creatingScenario = false;
  readingScenario = false;
  scenarioIsValid: boolean;

  constructor(private _alertService: AlertService,
    private _scenariosService: ScenariosService,
    private _dialogRef: MatDialogRef<ImportScenarioComponent>) { }

  ngOnInit() {
    this._fileReader.onloadend = this.generateJSON;
  }

  selectFile(event) {
    this.scenarioIsValid = false;
    this.readingScenario = true;
    try {
      this._fileReader.readAsText(event.target.files[0]);
    } catch (error) {
      this.readingScenario = false;
    }
  }

  generateJSON() {
    try {
      this.scenario = JSON.parse(this._fileReader.result);
      this.scenarioIsValid = this.checkValidity();
    } catch (error) {
      this.scenarioIsValid = false;
    }
    this.readingScenario = false;
  }

  checkValidity() {
    this.scenario.id = null;
    this.scenario.scenarioName = this.scenario.scenarioName || '-';
    this.scenario.scenarioDescription = this.scenario.scenarioDescription || '';

    Object.keys(environmentParams).forEach(param => {
      if (!this.scenario[param]) {
        this.scenario[param] = 0;
      }
    });
    // A valid scenario need to have liabilities and either cost/revenue data or free cash flows
    return this.checkAccountingDataParams(undefined) && (this.checkAccountingDataParams(true) || this.checkAccountingDataParams(false));
  }

  checkAccountingDataParams(showOnCalculation: Boolean) {
    const filteredParams = Array.from(accountingDataParams)
      .filter(([param, paramDefinition]) => paramDefinition.showOnCalculation === showOnCalculation);
    return filteredParams.length === filteredParams.filter(([param, _]) => this.scenario[param]).length;
  }

  createScenario() {
    this._scenariosService.addScenario(this.scenario).subscribe(
      () => {
        this._alertService.success('Das Szenario wurde erfolgreich importiert.');
        this._dialogRef.close();
      },
      () => this._alertService.warning('Das Szenario konnte nicht importiert werden.')
    );
  }

}
