import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Scenario } from '../api/scenario';
import { ExcelService } from '../service/excel.export.service';
import { ScenariosService } from '../service/scenarios.service';




@Component({
  selector: 'app-export-scenario',
  templateUrl: './export-scenario.component.html',
  styleUrls: ['./export-scenario.component.css'],
})


export class ExportScenarioComponent implements OnInit {
  //csvBlobUrl: SafeUrl;
  jsonBlobUrl: SafeUrl;
  scenarios$: Observable<Scenario[]>;
  scenarioList: Scenario[];


  
  constructor(
    private scenariosService: ScenariosService,
    private excelService: ExcelService,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ExportScenarioComponent>,
    private _domSanitizer: DomSanitizer) { }

  ngOnInit() {
    //Alle Szenarien als JSON[] laden
    this.scenarios$ = this.scenariosService.getScenarios();
    this.scenarios$.subscribe(scenarios => {this.scenarioList = scenarios} );
    //Aktuelles Szenario als JSON laden
    this.jsonBlobUrl = this._domSanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(new Blob([JSON.stringify(this.data.scenario)], { type: 'application/json' })));
  }

  closeSheet() {
    this._bottomSheetRef.dismiss();
  }

  massExport() {    
    console.log(this.scenarioList);

    this.excelService.exportAsExcelFile(this.scenarioList,"test");
    this.closeSheet();
  }

}
