import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { debounceTime, map, first } from 'rxjs/operators';
import { Scenario, DataPoint } from '../api/scenario';
import { Observable, Subscription, identity } from 'rxjs';
import { accountingDataParams } from '../api/paramData';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';
import { HtmlParser } from '@angular/compiler';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSlideToggle } from '@angular/material';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class AccountingDataComponent implements OnInit, OnDestroy {
  @Input() _editable: Boolean;
  @Input() initialData: Observable<Scenario>;
  @Output() formGroupOutput = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  Array = Array; // needed due to context issues in ngFor
  base: { year: number, quarter: number };
  start: { year: number, quarter: number }; // debounced values
  end: { year: number, quarter: number };
  fcf_slide = false;
  quarter_slide_disabled = false;
  quarter_slide = false;
  ownOrder_slide = false;
  ownOrder = true;
  brown = false;
  usedModel = "arma";
  accountingDataParams = accountingDataParams;
  private scenarioSubscription: Subscription;
  scenario : Scenario;
  

  constructor(
    private _formBuilder: FormBuilder, 
    private _timeSeriesMethodsService: TimeSeriesMethodsService)
     {
  }

  ngOnInit() {
    
    if (this.initialData) {
      this.initialData.subscribe((scenario) => 
      this.scenario = scenario);
      console.log(this.scenario);
      if (this.scenario && this.scenario.liabilities.timeSeries[0] && this.scenario.liabilities.timeSeries[0].date.quarter) {
        this.quarter_slide = true
      }
      
      if (this.scenario && this.scenario.brownRozeff) {
        this.brown = true;
      }
      this.buildForm(this.scenario);
    } else {
      this.buildForm();
      
    }
    
  }

  ngOnDestroy() {
    // unsubscribe from the @Input scenario to not execute another validation round when this component is destroyed.
    if (this.scenarioSubscription) { this.scenarioSubscription.unsubscribe(); }
  }

onModelChanged(value){

this.usedModel = value;

if(value === "arma"){
  
  this.ownOrder = true;
  this.quarter_slide_disabled = false;
  this.quarter_slide = false;
  this.brown = false;
  
  

} else if(value === "brown") {

  this.quarter_slide_disabled = true;
  this.quarter_slide = true;
  this.brown = true;
  
  this.ownOrder = false;
  this.ownOrder_slide = false;
  
  
}
if (this.scenario){
  this.buildForm(this.scenario);
} else {
  this.buildForm();
}

  }

  onOwnOrderChanged(value){
this.ownOrder_slide = value;
  }

  @Input() set editable(value: Boolean) {
    if (this._editable !== value) {
      this._editable = value;
      this.buildForm(this.scenario);
      
    }
    
  }
  //Erzeugen der Forms um eingegebene Werte auslesen zu können
  buildForm(scenario?: Scenario) {
    if (scenario) {
      this.calculateInterval(scenario);
    } else {
      this.base = { year: new Date().getFullYear() - 1, quarter: 1 };
      this.start = { year: this.base.year - 1, quarter: 1 };
      this.end = { year: this.base.year + 2, quarter: 1 };
    }
    //Zeitreihen Form
    const newFormGroup = this._formBuilder.group({
      start: this._formBuilder.group({ year: [this.start.year, Validators.required], quarter: [this.start.quarter, Validators.required] }),
      end: this._formBuilder.group({ year: [this.end.year, Validators.required], quarter: [this.end.quarter, Validators.required] }),
      base: this._formBuilder.group({ year: [this.base.year, Validators.required], quarter: [this.base.quarter, Validators.required] }),
      calculateFcf: [(scenario && scenario.additionalIncome && scenario.additionalIncome.timeSeries.length > 0) || false,
      Validators.required],
      quarterly: [(scenario && scenario.liabilities.timeSeries[0] && scenario.liabilities.timeSeries[0].date.quarter) || false,
      Validators.required],
      ownOrder: [],
      usedModel: [],
    }, {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      });
    this.buildParamFormGroups(newFormGroup, scenario);
    this.formGroup = newFormGroup;
    this.updateTable();
    this.formGroupOutput.emit(this.formGroup);
    this.formGroup.controls.quarterly.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.quarterlyChanged();
      this.updateTable();
    });
    this.formGroup.controls.start.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.start = val;
      this.updateTable();
    });
    this.formGroup.controls.end.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.end = val;
      this.updateTable();
    });
  }
  //Falls aufruf in Scenario-detail -> Daten für Intervall zuweisen
  calculateInterval(scenario: Scenario) {
    const params = Array.from(this.accountingDataParams.keys()); //AccountingDataParams => hinterlegte Zeitdaten der Bspw. FreeCashFlow
    this.start = undefined;
    this.end = undefined;
    this.base = undefined;
    for (let i = 0; i < params.length; i++) {
      const accountingFigure = scenario[params[i]]; //Zeitreihe der einzelnen Parameter
      if (accountingFigure && accountingFigure.timeSeries && accountingFigure.timeSeries.length > 0) {
        if (!this.start && accountingFigure.isHistoric) { //Historic(prognostizieren)-true
          this.start = {
            year: accountingFigure.timeSeries[0].date.year,
            quarter: accountingFigure.timeSeries[0].date.quarter ? accountingFigure.timeSeries[0].date.quarter : 1,
          };
          this.base = this.base || {
            year: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].date.year,
            quarter: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].date.quarter ?
              accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].date.quarter : 1,
          };
        } else if (!this.end && !accountingFigure.isHistoric) { //Historic(prognostizieren)-false
          const shiftDeterministic = this.accountingDataParams.get(params[i]).shiftDeterministic;//shiftDeterministic(true or undefined) gibt an, ob man sich im Parameter 'liabilities' befindet
          let dataPoint = accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1]; //Endyear abrufen
          
          let year = dataPoint.date.year +
            ((shiftDeterministic && (!dataPoint.date.quarter || dataPoint.date.quarter === 4)) ? 1 : 0);
          let quarter = this.calcQuarter(dataPoint,shiftDeterministic);
          /*((!dataPoint.date.quarter) ? 4 : ((shiftDeterministic && dataPoint.date.quarter === 4) ? 1 :
            (dataPoint.date.quarter + (shiftDeterministic) ? 1 : 0)));*/
          
            this.end = {
            year: year,
            quarter: quarter,
          };
         
          dataPoint = accountingFigure.timeSeries[0]; //Startyear abrufen
          year = dataPoint.date.year +
            ((!shiftDeterministic && (!dataPoint.date.quarter || dataPoint.date.quarter === 1)) ? -1 : 0);
          quarter = !dataPoint.date.quarter ? 1 : (!shiftDeterministic && dataPoint.date.quarter === 1) ? 4 :
            dataPoint.date.quarter + (shiftDeterministic) ? -1 : 0;
          this.base = this.base || {
            year: year,
            quarter: quarter,
          };
        }
      }
      if (this.start && this.end) {
        return;
      }
    }
    if (this.end) {
      this.start = { year: this.base.year - 1, quarter: this.base.quarter };
    } else if (this.start) {
      const quarterly = Boolean(scenario && scenario.liabilities.timeSeries[0] && scenario.liabilities.timeSeries[0].date.quarter) || false;
      this.end = this._timeSeriesMethodsService.addPeriods({...this.base}, scenario.periods, quarterly);
    } else {
      this.base = { year: new Date().getFullYear() - 1, quarter: 1 };
      this.start = { year: this.base.year - 1, quarter: 1 };
      this.end = { year: this.base.year + 1, quarter: 4 };
    }
  }

  buildParamFormGroups(formGroup: FormGroup, scenario?: Scenario) {
    for (const param of this.accountingDataParams.keys()) {
      const timeSeries = [];
      
      if (scenario && scenario[param] && scenario[param].timeSeries) {
        const items = scenario[param].timeSeries.filter(dataPoint => this._timeSeriesMethodsService.isInsideBounds(
          formGroup.controls.quarterly.value,
          this.start,
          this.end,
          dataPoint.date
        ));
        if (items.length > 0) {
          items.forEach((dataPoint) => {
            timeSeries.push(this._formBuilder.group({
              year: dataPoint.date.year,
              quarter: dataPoint.date.quarter,
              amount: [dataPoint.amount, Validators.required],
            }));
          });
        }
      }
      formGroup.addControl(param, this._formBuilder.group({
        isHistoric: this.calcHistoric(param, scenario),
        timeSeries: this._formBuilder.array(timeSeries),
        armaP: scenario && scenario[param] ? scenario[param].order[0] : 0,
        armaQ: scenario && scenario[param] ? scenario[param].order[2] : 0,
        score: scenario && scenario[param] ? scenario[param].score : "",
      }));
      
    }
  }

  calcHistoric(param, scenario) {
   // (scenario && scenario[param]) ? ((scenario[param].isHistoric || (this.usedModel == "brown" && param != "liabilities")) : (this.usedModel == "brown" && param != "liabilities") ? true : false
  if (scenario && scenario[param]) {
    return scenario[param].isHistoric || (this.usedModel == "brown" && param != "liabilities");
  } else if (this.usedModel == "brown" && param != "liabilities") {
    return true;
  } else {
    return false;
  }
  }

  get timeSeriesControls() {
    try {
      return ((this.formGroup.controls.liabilities as FormGroup).controls.timeSeries as FormArray).controls;
    } catch (err) {
      return undefined;
    }
  }

  quarterlyChanged() {
    if (this.scenario) {
      return;
    }
    const quarterly = this.formGroup.controls.quarterly.value;
    for (const param of this.accountingDataParams.keys()) {
      const newTimeSeries = [];
      const timeSeries = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      if (quarterly) {
        timeSeries.value.forEach(dataPoint => {
          for (let i = 1; i < 5; i++) {
            if ((dataPoint.year === this.start.year && dataPoint.quarter < this.start.quarter) ||
              (dataPoint.year === this.end.year && dataPoint.quarter > this.end.quarter)) {
              continue;
            } else {
              newTimeSeries.push(this._formBuilder.group({
                year: dataPoint.year,
                quarter: i,
                amount: dataPoint.amount / 4,
              }));
            }
          }
        });
      } else {
        while (timeSeries.length > 0) {
          const valuesOfYear = [];
          do {
            valuesOfYear.push(timeSeries.value[0]);
            timeSeries.removeAt(0);
          } while (timeSeries.length > 0 && timeSeries.value[0].year === valuesOfYear[0].year);
          newTimeSeries.push(this._formBuilder.group({
            year: valuesOfYear[0].year,
            amount: valuesOfYear.reduce((a, b) => a + b.amount, 0),
          }));
        }
      }
      (<FormGroup>this.formGroup.controls[param]).setControl('timeSeries', this._formBuilder.array(newTimeSeries));
    }
  }
  
  createFinancialData(timeSeries: FormArray, year: number, quarter?: number, index?: number) {
    let group;
    if (quarter) {
      group = this._formBuilder.group({
        year: year,
        quarter: quarter,
        amount: [0, Validators.required],
      });
    } else {
      group = this._formBuilder.group({
        year: year,
        amount: [0, Validators.required],
      });
    }
    if (index !== undefined) {
      timeSeries.insert(index, group);
    } else {
      timeSeries.push(group);
    }
  }
  //Spalten hinzufügen in der Zahlungsreihe
  fillTimeSeriesGaps(timeSeries, start, end, insertAtStart = false, shiftByOne = false) {
    const quarterly = this.formGroup.value.quarterly;
    const startYear = start.year + (shiftByOne && (!quarterly || end.quarter === 4) ? 1 : 0);
    const endYear = end.year + (quarterly || shiftByOne ? 1 : 0) + (quarterly && end.quarter === 4 && shiftByOne ? 1 : 0);
    let insertCount = 0;
    for (let currentYear = startYear;
      currentYear < endYear;
      currentYear++) {
      if (quarterly) {
        for (let currentQuarter = (currentYear === startYear ?
          start.quarter + (shiftByOne ? 1 : 0) : 1);
          currentQuarter < (currentYear === end.year ? end.quarter + (shiftByOne ? 1 : 0) : 5); currentQuarter++) {
          this.createFinancialData(timeSeries, currentYear, currentQuarter, insertAtStart ? insertCount++ : undefined);
        }
      } else {
        this.createFinancialData(timeSeries, currentYear, undefined, insertAtStart ? insertCount++ : undefined);
      }
    }
  }

  trackByYearQuarter(i: number, o) {
    return o.value.year + (o.value.quarter ? ';' + o.value.quarter : '');
  }

  updateTable() {
    const start = this.formGroup.controls.start.value;
    const end = this.formGroup.controls.end.value;
    for (const param of this.accountingDataParams.keys()) {
      const formGroup = <FormGroup>this.formGroup.controls[param];
      formGroup.setControl('timeSeries', this._formBuilder.array((<FormArray>formGroup.controls.timeSeries).controls.filter(control =>
        this._timeSeriesMethodsService.isInsideBounds(
          this.formGroup.controls.quarterly.value,
          this.start,
          this.end,
          control.value))));
      const timeSeries = <FormArray>formGroup.controls.timeSeries;
      // Fill up missing values between the start and first value
      if (timeSeries.length > 0) {
        this.fillTimeSeriesGaps(timeSeries, start, timeSeries.value[0], true);
        this.fillTimeSeriesGaps(timeSeries, timeSeries.value[timeSeries.value.length - 1], end, false, true);
      } else {
        this.fillTimeSeriesGaps(timeSeries, start, end);
        this.createFinancialData(timeSeries, end.year, this.formGroup.value.quarterly ? end.quarter : undefined);
      }

    }
  }

  validateForm(formGroup: FormGroup) {
    const paramsAreValid = Array.from(this.accountingDataParams.keys()).map(param => {
      const paramFormGroup = (<FormGroup>formGroup.controls[param]);
      if (paramFormGroup) {
        const timeSeries = (<FormArray>paramFormGroup.controls.timeSeries).controls;
        return timeSeries
          .filter(dataPoint =>
            this._timeSeriesMethodsService.isInsideBounds(
              formGroup.controls.quarterly.value,
              this.start,
              this.end,
              dataPoint.value
            ) &&
            this._timeSeriesMethodsService.checkVisibility(
              dataPoint.value,
              paramFormGroup.value.isHistoric,
              formGroup.controls.quarterly.value,
              formGroup.controls.base.value,
              this.end,
              this.accountingDataParams.get(param).shiftDeterministic))
          .every(dataPoint => dataPoint.valid);
      } else {
        return false;
      }
    }).every(Boolean);

    const intervalIsValid = formGroup.controls.base.valid &&
      formGroup.controls.start.valid &&
      formGroup.controls.end.valid;

    if (paramsAreValid && intervalIsValid) {
      return null;
    } else {
      const errors = {};
      if (!paramsAreValid) {
        errors['params'] = { valid: paramsAreValid };
      }
      if (!intervalIsValid) {
        errors['interval'] = { valid: paramsAreValid };
      }
    }
  }

  checkMinIntegrity(limit, subject, periodsBetween = 1) {
    if (this._timeSeriesMethodsService.calculatePeriod(limit.value, subject.value, this.formGroup.value.quarterly) < periodsBetween) {
      subject.setValue(this._timeSeriesMethodsService.addPeriods({...limit.value}, periodsBetween, this.formGroup.value.quarterly));
    }
  }

  checkMaxIntegrity(limit, subject, periodsBetween = 1) {
    if (this._timeSeriesMethodsService.calculatePeriod(subject.value, limit.value, this.formGroup.value.quarterly) < periodsBetween) {
      subject.setValue(this._timeSeriesMethodsService.addPeriods({...limit.value}, -periodsBetween, this.formGroup.value.quarterly));
    }
  }

  calcQuarter(dataPoint:DataPoint,shiftDeterministic: Boolean){
   
    if (!dataPoint.date.quarter) {
      return 4;
    } else if (shiftDeterministic && dataPoint.date.quarter === 4) {
      return 1;
    } else if (shiftDeterministic) {
      return dataPoint.date.quarter + 1;
    } else {
      return dataPoint.date.quarter;
    }
  }

  
}
