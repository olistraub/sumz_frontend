import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger, MatBottomSheet } from '@angular/material';
import { Scenario } from '../api/scenario';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ScenariosService } from '../service/scenarios.service';
import { Wrapper } from '../api/wrapper';
import { AlertService } from '../service/alert.service';
import { ExportScenarioComponent } from '../export-scenario/export-scenario.component';
import { Router } from '@angular/router';
//import { ScenarioDetailComponent } from '../scenario-detail/scenario-detail.component';


@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css'],
})


export class ScenarioCardComponent implements OnInit {
  @Input() scenario: Wrapper<Scenario>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  hovered: Boolean;

  constructor(private _scenariosService: ScenariosService,
    private _alertService: AlertService,
	private _dialog: MatDialog,
	private _router: Router,
	//private _scenarioDetail: ScenarioDetailComponent,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.hovered = false;
  }

  toggleScenarioMenu(event: Event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  removeScenario() {
    this._dialog.open(DeleteDialogComponent, { data: { scenario: this.scenario.valueOf() } })
      .afterClosed().subscribe((result) => {
        if (result === true) {
          this._scenariosService.removeScenario(this.scenario.valueOf())
            .subscribe(
              removed => this._alertService.success(`Das Szenario "${this.scenario.valueOf().scenarioName}" wurde erfolgreich gelöscht`),
              error => this._alertService.error(`Das Szenario "${this.scenario.valueOf().scenarioName}" konnte nicht gelöscht werden
                 (${error.message})`)
            );
        }
      });
  }

  exportScenario() {
    this._bottomSheet.open(ExportScenarioComponent, { data: { scenario: this.scenario } });
  }

  	changeScenario() {
	 this._router.navigate(['/scenario', this.scenario.valueOf().id]);
	 this._scenariosService.help = true;
	 this._scenariosService.onEditScenario(true);
	}

}

