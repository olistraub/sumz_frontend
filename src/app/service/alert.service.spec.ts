import { TestBed, inject } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatSnackBarModule } from '@angular/material';

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        AlertService,
      ],
    });
  });

  it('should be created', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));
});
