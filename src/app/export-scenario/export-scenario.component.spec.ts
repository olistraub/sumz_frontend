import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportScenarioComponent } from './export-scenario.component';
import { MaterialModule } from '../material.module';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Scenario } from '../api/scenario';

describe('ExportScenarioComponent', () => {
  let component: ExportScenarioComponent;
  let fixture: ComponentFixture<ExportScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportScenarioComponent],
      imports: [MaterialModule],
      providers: [
        { provide: MatBottomSheetRef, useValue: { dismiss() { } } },
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: {
            scenario:
              {
                scenarioName: 'Eins',
                scenarioDescription: 'Eine Beschreibung',
              } as Scenario,
          },
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
