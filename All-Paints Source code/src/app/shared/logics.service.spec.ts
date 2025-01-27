import { TestBed } from '@angular/core/testing';

import { LogicsService } from './logics.service';

describe('LogicsService', () => {
  let service: LogicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
