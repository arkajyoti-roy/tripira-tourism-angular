import { TestBed } from '@angular/core/testing';

import { PhotoGallery } from './photo-gallery';

describe('PhotoGallery', () => {
  let service: PhotoGallery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoGallery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
