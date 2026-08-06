import { TestBed } from '@angular/core/testing';

import { VideoGallery } from './video-gallery';

describe('VideoGallery', () => {
  let service: VideoGallery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoGallery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
