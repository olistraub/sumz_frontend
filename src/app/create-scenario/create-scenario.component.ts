import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { accountingDataParams, environmentParams } from '../api/paramData';
import { Scenario } from '../api/scenario';
import { SelectScenarioComponent } from '../select-scenario/select-scenario.component';
import { AlertService } from '../service/alert.service';
import { ScenariosService } from '../service/scenarios.service';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css'],
})
export class CreateScenarioComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  busy: Boolean;
  color: string;
  importedScenario: EventEmitter<Scenario>;
  accountingDataParams = accountingDataParams; // fix scope issues in view
  environmentParams = environmentParams;
  Object = Object;

  constructor(private _formBuilder: FormBuilder,
    private _scenariosService: ScenariosService,
    private _router: Router,
    private _alertService: AlertService,
    private _bottomSheet: MatBottomSheet,
    private _timeSeriesMethodsService: TimeSeriesMethodsService) {
  }

  ngOnInit() {
    this.busy = false;
    this.color = "red";
    this.formGroup1 = this._formBuilder.group({
      scenarioName: ['', Validators.required],
      scenarioDescription: ['', Validators.required],
    });
    const environmentParamControls = {};
    Object.entries(environmentParams).forEach(([name, config]) => {
      environmentParamControls[name] = ['', config.validators];
    });
    this.formGroup2 = this._formBuilder.group(environmentParamControls);
    this.formGroup3 = this._formBuilder.group({});
    this.importedScenario = new EventEmitter<Scenario>();
  }

  onColorChanged(evt){
    this.color = evt.source.id;
  }

  createScenario() {
    if (this.formGroup3.valid) {
      const start = this.formGroup3.controls.start.value;
      const base = this.formGroup3.controls.base.value;
      const end = this.formGroup3.controls.end.value;
      const quarterly = this.formGroup3.controls.quarterly.value;

      this.busy = true;
      const scenario: Scenario = {
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        stochastic: false,
        periods: this._timeSeriesMethodsService.calculatePeriod(base, end, quarterly),
        scenarioColor: this.color,
      };
      
      Object.keys(this.formGroup2.controls).forEach(param => scenario[param] = scenario[param] / 100);
      for (const [paramName, paramDefinition] of this.accountingDataParams) {
        if (this._timeSeriesMethodsService.shouldDisplayAccountingDataParam(
          this.accountingDataParams, this.formGroup3.controls.calculateFcf.value, paramName)) {
          const paramFormGroup = this.formGroup3.controls[paramName];
          if (paramFormGroup.value.isHistoric && !scenario.stochastic) {
            scenario.stochastic = true;
          }
          scenario[paramName] = {
            isHistoric: paramFormGroup.value.isHistoric,
            timeSeries: this._timeSeriesMethodsService.convertToBackendFormat(
              paramFormGroup.value.timeSeries.filter(dataPoint =>
                this._timeSeriesMethodsService.isInsideBounds(quarterly, start, end, dataPoint)
                && this._timeSeriesMethodsService.checkVisibility(dataPoint, paramFormGroup.value.isHistoric, quarterly, base, end,
                  paramDefinition.shiftDeterministic))
            ),
          };
        }
      }
      
      this._scenariosService.addScenario(scenario)
        .subscribe(
          (createdScenario) => {
            this._alertService.success('Das Szenario wurde erfolgreich erstellt');
            this._router.navigate(['/scenario', createdScenario.id]);
          },
          (error) => {
            this._alertService.error(`Das Szenario konnte nicht erstellt werden. (${error.statusText})`);
            this.busy = false;
          },
          () => this.busy = false
        );
    }
  }

  openSelectionSheet() {
    this._bottomSheet.open(SelectScenarioComponent).afterDismissed().subscribe(this.insertScenarioData.bind(this));
  }

  insertScenarioData(scenario: Scenario) {
    if (scenario) {
      if (this.formGroup1.value.name === null) {
        this.formGroup1.controls.name.setValue(scenario.scenarioName);
      }
      if (this.formGroup1.value.description === null) {
        this.formGroup1.controls.description.setValue(scenario.scenarioDescription);
      }
      Object.entries(this.formGroup2.controls).forEach(([key, control]) => control.setValue(scenario[key] * 100));
      this.importedScenario.emit(scenario);
      this._alertService.success(`Die Daten des Szenarios "${scenario.scenarioName}" wurden erfolgreich übernommen`);
    }
  }

  trackByName([name, config]) {
    return name;
  }

}
