import { TestBed } from '@angular/core/testing';

import { TouristCategory } from './tourist-category';

describe('TouristCategory', () => {
  let service: TouristCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouristCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
