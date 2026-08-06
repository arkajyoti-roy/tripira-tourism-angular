import { TestBed } from '@angular/core/testing';

import { Adventure } from './adventure';

describe('Adventure', () => {
  let service: Adventure;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adventure);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
