import { TestBed, inject } from '@angular/core/testing';

import { TimeSeriesMethodsService } from './time-series-methods.service';

describe('TimeSeriesMethodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeSeriesMethodsService],
    });
  });

  it('should be created', inject([TimeSeriesMethodsService], (service: TimeSeriesMethodsService) => {
    expect(service).toBeTruthy();
  }));

  it('should correctly find out if a point is outside the time series\' bounds',
    inject([TimeSeriesMethodsService], (service: TimeSeriesMethodsService) => {
      const testData = [
        {
          parameters: [
            false,
            { year: 1000, quarter: 2 },
            { year: 1001, quarter: 1 },
            { year: 1000, quarter: 1 }],
          result: true,
        },
        {
          parameters: [
            false,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1001, quarter: 2 }],
          result: true,
        },
        {
          parameters: [
            false,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1002, quarter: 1 }],
          result: false,
        },
        {
          parameters: [
            false,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 999, quarter: 1 }],
          result: false,
        },
        {
          parameters: [
            true,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1000, quarter: 1 }],
          result: true,
        },
        {
          parameters: [
            true,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1001, quarter: 1 }],
          result: true,
        },
        {
          parameters: [
            true,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1000, quarter: 4 }],
          result: true,
        },
        {
          parameters: [
            true,
            { year: 1000, quarter: 1 },
            { year: 1001, quarter: 1 },
            { year: 1001, quarter: 2 }],
          result: false,
        },
      ];
      testData.forEach(data =>
        expect(service.isInsideBounds.apply(service, data.parameters))
          .toBe(data.result)
      );
    }));
    it('should calculate the total interval', inject([TimeSeriesMethodsService], (service: TimeSeriesMethodsService) => {
      const testData = [
        {
          parameters: [
            { year: 1001, quarter: 1 },
            { year: 1001, quarter: 1 },
            false,
          ],
          result: 0,
        },
        {
          parameters: [
            { year: 1000, quarter: 1 },
            { year: 1005, quarter: 1 },
            false,
          ],
          result: 5,
        },
        {
          parameters: [
            { year: 1000, quarter: 1 },
            { year: 1002, quarter: 2 },
            true,
          ],
          result: 9,
        },
        {
          parameters: [
            { year: 1000, quarter: 2 },
            { year: 1002, quarter: 1 },
            true,
          ],
          result: 7,
        },
      ];
      testData.forEach(data =>
        expect(service.calculatePeriod.apply(service, data.parameters))
          .toBe(data.result)
      );
    }));
});
