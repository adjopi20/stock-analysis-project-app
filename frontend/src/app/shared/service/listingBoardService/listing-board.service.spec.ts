import { TestBed } from '@angular/core/testing';

import { ListingBoardService } from './listing-board.service';

describe('ListingBoardService', () => {
  let service: ListingBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
