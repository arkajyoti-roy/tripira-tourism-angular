import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGalleries } from './photo-galleries';

describe('PhotoGalleries', () => {
  let component: PhotoGalleries;
  let fixture: ComponentFixture<PhotoGalleries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGalleries],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGalleries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
