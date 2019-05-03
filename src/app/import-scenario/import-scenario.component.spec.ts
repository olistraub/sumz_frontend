import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { MaterialModule } from '../material.module';
import { ScenariosService } from '../service/scenarios.service';
import { ScenariosServiceMock } from '../service/scenarios.service.mock';
import { ImportScenarioComponent } from './import-scenario.component';


describe('ImportScenarioComponent', () => {
  let component: ImportScenarioComponent;
  let fixture: ComponentFixture<ImportScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportScenarioComponent],
      imports: [MaterialModule],
      providers: [{ provide: MatDialogRef, useValue: { close() { } } }, { provide: ScenariosService, useClass: ScenariosServiceMock }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
