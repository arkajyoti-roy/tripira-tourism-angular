import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Directorate } from './directorate';

describe('Directorate', () => {
  let component: Directorate;
  let fixture: ComponentFixture<Directorate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Directorate],
    }).compileComponents();

    fixture = TestBed.createComponent(Directorate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
