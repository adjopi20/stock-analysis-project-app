import { TestBed } from '@angular/core/testing';

import { AllStocksService } from './all-stocks.service';

describe('AllStocksService', () => {
  let service: AllStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
