import { TestBed } from '@angular/core/testing';

import { FuncionalityService } from './funcionality.service';

describe('FuncionalityService', () => {
  let service: FuncionalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
