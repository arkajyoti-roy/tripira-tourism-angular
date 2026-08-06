import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accommodation } from './accommodation';

describe('Accommodation', () => {
  let component: Accommodation;
  let fixture: ComponentFixture<Accommodation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accommodation],
    }).compileComponents();

    fixture = TestBed.createComponent(Accommodation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
