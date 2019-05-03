import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Scenario } from '../api/scenario';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MaterialModule } from '../material.module';
import { ScenarioDetailComponent } from '../scenario-detail/scenario-detail.component';
import { ScenariosService } from '../service/scenarios.service';
import { ScenariosComponent } from './scenarios.component';
import { AccountingDataComponent } from '../accounting-data/accounting-data.component';
import { ChartModule } from 'angular-highcharts';
import { RouterTestingModule } from '@angular/router/testing';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';

describe('ScenariosComponent', () => {
  let component: ScenariosComponent;
  let fixture: ComponentFixture<ScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenariosComponent, ScenarioDetailComponent, CreateScenarioComponent, ScenarioCardComponent, AccountingDataComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ChartModule,
        RouterTestingModule.withRoutes(
          [{ path: 'scenario/:id', component: ScenarioDetailComponent },
          { path: 'create', component: CreateScenarioComponent }]
        )],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ScenariosService, useValue: {
            scenarios$: of([{ id: 1, scenarioName: 'Eins', scenarioDescription: 'Das erste Szenario' } as Scenario]),
            getScenarios: () => this.scenarios$,
          } as ScenariosService,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
