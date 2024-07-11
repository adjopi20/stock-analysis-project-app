import { TestBed } from '@angular/core/testing';

import { AllStockService } from './all-stock.service';

describe('AllStockService', () => {
  let service: AllStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
