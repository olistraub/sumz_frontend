import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-export-scenario',
  templateUrl: './export-scenario.component.html',
  styleUrls: ['./export-scenario.component.css'],
})
export class ExportScenarioComponent implements OnInit {
  // csvBlobUrl: SafeUrl;
  jsonBlobUrl: SafeUrl;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ExportScenarioComponent>,
    private _domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.jsonBlobUrl = this._domSanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(new Blob([JSON.stringify(this.data.scenario)], { type: 'application/json' })));
  }

  closeSheet() {
    this._bottomSheetRef.dismiss();
  }

}
