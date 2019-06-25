import { animate, keyframes, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Observable, noop, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { RemoteConfig } from '../api/config';
import { accountingDataParams, environmentParams } from '../api/paramData';
import { Scenario } from '../api/scenario';
import { AlertService } from '../service/alert.service';
import { OptionsService } from '../service/options.service';
import { ScenariosService } from '../service/scenarios.service';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ExportScenarioComponent } from '../export-scenario/export-scenario.component';
import { Wrapper } from '../api/wrapper';

@Component({
  selector: 'app-scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.css'],
  animations: [
    trigger('toggleEditAnimation', [
      transition('* => *', [
        query(':enter', [
          style({
            position: 'absolute',
            opacity: 0,
            right: 0,
          }),
        ], {
            optional: true,
          }),
        query(':leave', [
          animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
            style({
              transform: 'translateY(0px)',
              opacity: 1,
            }),
            style({
              transform: 'translateY(15px)',
              opacity: 0,
            }),
          ])),
          style({
            position: 'absolute',
            opacity: 0,
            right: 0,
          }),
        ], {
            optional: true,
          }),
        query(':enter', [
          style({
            position: 'static',
          }),
          animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
            style({
              transform: 'translateY(15px)',
              opacity: 0,
            }),
            style({
              transform: 'translateY(0px)',
              opacity: 1,
            }),
          ])),
        ], {
            optional: true,
          }),
      ]),
    ]),
  ],
})

export class ScenarioDetailComponent implements OnInit {

  forScenario$: Observable<Scenario>;
  forConfig$: Observable<RemoteConfig>;
  formGroup: FormGroup;
  accountingDataFormGroup: FormGroup;
  configFormGroup: FormGroup;
  accountingDataParams = accountingDataParams;
  environmentParams = environmentParams; // fix scope issues in view
  Object = Object;
  busy = false;
  color: string;

  /* edit mode */
  editable

  /* step holder for panels */
  step = 0;

  /*chart */
  chart;

  private forScenarioId$: Observable<number>;

  constructor(private _scenariosService: ScenariosService,
    private _formBuilder: FormBuilder,
    private _optionsService: OptionsService,
    private _alertService: AlertService,
    private _route: ActivatedRoute,
	private _router: Router,
	private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private _timeSeriesMethodsService: TimeSeriesMethodsService) { }

  ngOnInit() {
     
    this.forScenarioId$ = this._route.paramMap.pipe(
      switchMap(params => {
        return of(Number.parseInt(params.get('id')));
      })
    );
    this.forScenario$ = this._scenariosService.getScenario(this.forScenarioId$);
    this.forScenario$.subscribe(noop, error => this._alertService.error(`Fehler beim Laden des Szenarios: ${error}`));

    this.forConfig$ = this._optionsService.getConfig();

    const controls = {
      scenarioName: ['', Validators.required],
      scenarioDescription: ['', Validators.required],
    };
    Object.entries(environmentParams).forEach(([name, config]) => {
      controls[name] = ['', config.validators];
    });
    this.formGroup = this._formBuilder.group(controls);
    this.formGroup.disable();
    this.initData();

    this.configFormGroup = this._formBuilder.group({
      apv: false,
      cvd: false,
      fcf: false,
      fte: false,
    });
    this.configFormGroup.disable();
    this.initConfig();

    const subscription = this.forScenario$.subscribe(currentScenario => {
      this.chart = new Chart({
        chart: {
          type: 'line',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: '',
        },
        yAxis: {
          title: {
            text: 'Wahrscheinlichkeitsdichte',
          },
        },
        xAxis: {
          categories: (currentScenario.stochastic ? currentScenario.companyValueDistribution.xValues : []),
          title: {
            text: 'Unternehmenswert in €',
          },
          labels: {
            format: '{value:.0f}',
          },
          allowDecimals: false,
        },
        series: [{
          name: ' ',
          data: (currentScenario.stochastic ? currentScenario.companyValueDistribution.yValues : []),
        }],
      });
    });
    //Subcriber für das Scenario bearbeiten Event aus scenario-card
  this.editable = false;
  
  if (this._scenariosService.help) {
    this.editable = true;
		this._scenariosService.subsVar = this._scenariosService.invokeOtherComponentFuction.subscribe(
      () => {
			this.setEditable(true);
		  });
  this.setEditable(true);
  }

	this._scenariosService.help = false;
  
}

  initData() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.color = currentScenario.scenarioColor;
      this.formGroup.controls.scenarioName.setValue(currentScenario.scenarioName);
      this.formGroup.controls.scenarioDescription.setValue(currentScenario.scenarioDescription);
      Object.keys(environmentParams).forEach(key => this.formGroup.controls[key].setValue(currentScenario[key] * 100));
    });
  }

  initConfig() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.forConfig$.pipe(first()).subscribe(remote => {
        if (!remote.scenarioConfig.get(currentScenario.id)) {
          remote.scenarioConfig.set(currentScenario.id, { showResult: { apv: true, cvd: true, fcf: true, fte: true } });
        }
        this.configFormGroup.setValue(remote.scenarioConfig.get(currentScenario.id).showResult);
      });
    });
  }

  exportScenario() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
    this._bottomSheet.open(ExportScenarioComponent, { data: { scenario: currentScenario } });
  });
}

  removeScenario() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
    this._dialog.open(DeleteDialogComponent, { data: { scenario: currentScenario } })
      .afterClosed().subscribe((result) => {
        if (result === true) {
          this._scenariosService.removeScenario(currentScenario)
            .subscribe(
              removed => this._alertService.success(`Das Szenario "${currentScenario.scenarioName}" wurde erfolgreich gelöscht`),
              error => this._alertService.error(`Das Szenario "${currentScenario.scenarioName}" konnte nicht gelöscht werden
                 (${error.message})`)
            );
        }
      });
      this._router.navigate(['/']);
    });
  }

  saveScenario() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      currentScenario.scenarioColor = this.color;
      currentScenario.scenarioName = this.formGroup.controls.scenarioName.value;
      currentScenario.scenarioDescription = this.formGroup.controls.scenarioDescription.value;
      Object.keys(environmentParams).forEach(key => currentScenario[key] = this.formGroup.controls[key].value / 100);

      const quarterly = this.accountingDataFormGroup.controls.quarterly.value;
      const start = this.accountingDataFormGroup.controls.start.value;
      const base = this.accountingDataFormGroup.controls.base.value;
      const end = this.accountingDataFormGroup.controls.end.value;

      currentScenario.stochastic = false;
      currentScenario.periods = this._timeSeriesMethodsService.calculatePeriod(base, end, quarterly);

      let order: number[];
      let seasonalOrder: number[];
      let p = 0;
      let q = 0;
      let usedModel = this.accountingDataFormGroup.controls.usedModel.value;

      if (usedModel === null){
        usedModel = "arma";
      }
      
          if (this.accountingDataFormGroup.controls.armaP.value !== null && this.accountingDataFormGroup.controls.armaQ.value !== null){
          p = this.accountingDataFormGroup.controls.armaP.value;
          q = this.accountingDataFormGroup.controls.armaQ.value;
        }

        if (usedModel === "arma"){
            if (this.accountingDataFormGroup.controls.ownOrder.value){
              order = [p,0,q];
              seasonalOrder = [0,0,0,0];
            }else{
              order = [0,0,0];
              seasonalOrder = [0,0,0,0];
            }
          
        }else if(usedModel === "brown"){
          order = [1,0,0];
          seasonalOrder = [0,1,1,4];
        }

      for (const [param, paramDefinition] of this.accountingDataParams) {
        if (this._timeSeriesMethodsService.shouldDisplayAccountingDataParam(
          this.accountingDataParams, this.accountingDataFormGroup.value.calculateFcf, param)) {
          const paramFormGroup = this.accountingDataFormGroup.controls[param];
          if (paramFormGroup.value.isHistoric && !currentScenario.stochastic) {
            currentScenario.stochastic = true;
          }
          currentScenario[param] = {
            isHistoric: paramFormGroup.value.isHistoric,
            timeSeries: this._timeSeriesMethodsService.convertToBackendFormat(
              paramFormGroup.value.timeSeries.filter(dataPoint =>
                this._timeSeriesMethodsService.isInsideBounds(quarterly, start, end, dataPoint) &&
                this._timeSeriesMethodsService.checkVisibility(
                  dataPoint,
                  paramFormGroup.value.isHistoric,
                  quarterly,
                  base,
                  end,
                  paramDefinition.shiftDeterministic))
            ),
            order: order,
            seasonalOrder: seasonalOrder,
          };
        }
      }
      this.step = 0;
      this.busy = true;
      this._scenariosService.updateScenario(currentScenario).subscribe(
        (scenario) => {
          this._router.navigate(['/scenario', scenario.id]);
          this.editable = false;
          this.formGroup.disable();
          this._alertService.success('Szenario wurde gespeichert');
          this.busy = false;
        },
        () => {
          this._alertService.warning('Szenario konnte nicht gespeichert werden');
          this.busy = false;
        },
      );
    });
  }

  saveConfig() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.forConfig$.pipe(first()).subscribe(remote => {
        const currentConfig = {
          ...remote.scenarioConfig.get(currentScenario.id),
          showResult: {
            apv: this.configFormGroup.controls.apv.value,
            cvd: this.configFormGroup.controls.cvd.value,
            fcf: this.configFormGroup.controls.fcf.value,
            fte: this.configFormGroup.controls.fte.value,
          },
        };

        remote.scenarioConfig.set(currentScenario.id, currentConfig);
        this._optionsService.setConfig(remote);
        this.configFormGroup.disable();
      });
    });
  }

  setEditable(editable: Boolean, save?: Boolean) {
    if (editable) {
      this.formGroup.enable();
      this.configFormGroup.enable();
      this.editable = editable;
    } else {
      if (save) {
        if (this.formGroup.valid && this.accountingDataFormGroup.valid) {
          this.saveConfig();
          this.saveScenario();
        } else {
          this._alertService.error('Speichern des Szenarios nicht möglich. Es sind noch Fehler vorhanden');
        }
      } else {
        this.editable = editable;
        this.formGroup.disable();
        this.configFormGroup.disable();
        this.initData();
        this.initConfig();
      }
    }
  }

  trackByName([name, config]) {
    return name;
  }
 
  onColorChanged(event){
    this.color = event.source.id;
  }
}
