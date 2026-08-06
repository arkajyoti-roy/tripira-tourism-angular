import { TestBed } from '@angular/core/testing';

import { Devcorp } from './devcorp';

describe('Devcorp', () => {
  let service: Devcorp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Devcorp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
