import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Devcorp } from './devcorp';

describe('Devcorp', () => {
  let component: Devcorp;
  let fixture: ComponentFixture<Devcorp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Devcorp],
    }).compileComponents();

    fixture = TestBed.createComponent(Devcorp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
