import { TestBed } from '@angular/core/testing';

import { Directorate } from './directorate';

describe('Directorate', () => {
  let service: Directorate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Directorate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
