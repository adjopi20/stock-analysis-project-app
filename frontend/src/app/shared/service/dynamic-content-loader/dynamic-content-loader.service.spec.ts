import { TestBed } from '@angular/core/testing';

import { DynamicContentLoaderService } from './dynamic-content-loader.service';

describe('DynamicContentLoaderService', () => {
  let service: DynamicContentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicContentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
