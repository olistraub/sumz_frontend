import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Scenario } from '../api/scenario';
import { MaterialModule } from '../material.module';
import { ScenariosService } from '../service/scenarios.service';
import { ScenarioCardComponent } from './scenario-card.component';
import { Wrapper } from '../api/wrapper';

describe('ScenarioCardComponent', () => {
  let component: ScenarioCardComponent;
  let fixture: ComponentFixture<ScenarioCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioCardComponent],
      imports: [MaterialModule],
      providers: [{ provide: ScenariosService, useValue: undefined }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioCardComponent);
    component = fixture.componentInstance;
    component.scenario = new Wrapper<Scenario>({
      id: 3,
      scenarioName: 'Testscenario',
      scenarioDescription: 'Testdesc',
    } as Scenario);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
