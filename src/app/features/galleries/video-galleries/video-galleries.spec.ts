import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoGalleries } from './video-galleries';

describe('VideoGalleries', () => {
  let component: VideoGalleries;
  let fixture: ComponentFixture<VideoGalleries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoGalleries],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoGalleries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
