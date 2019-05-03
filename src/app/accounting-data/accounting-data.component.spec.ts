import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDataComponent } from './accounting-data.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('AccountingDataComponent', () => {
  let component: AccountingDataComponent;
  let fixture: ComponentFixture<AccountingDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountingDataComponent],
      imports: [MaterialModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
