import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristCategory } from './tourist-category';

describe('TouristCategory', () => {
  let component: TouristCategory;
  let fixture: ComponentFixture<TouristCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristCategory],
    }).compileComponents();

    fixture = TestBed.createComponent(TouristCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
