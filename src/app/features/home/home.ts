import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { WhatsNewComponent } from './components/whats-new/whats-new';
import { FestivalsComponent } from './components/festivals/festivals';
import { DestinationsComponent } from './components/destinations/destinations';
import { ExploreComponent } from './components/explore/explore';
import { DiscoverComponent } from './components/discover/discover';
import { AccommodationsComponent } from './components/accommodations/accommodations';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { GalleryComponent } from './components/gallery/gallery';
// import { FavoriteToursComponent } from './components/favorite-tours/favorite-tours';
import { CuisinesExploreComponent } from './components/cuisines-explore/cuisines-explore';
@Component({
  selector: 'app-home',
  imports: [
    HeroComponent, 
    WhatsNewComponent, 
    FestivalsComponent, 
    DestinationsComponent,
    ExploreComponent,
    DiscoverComponent,
    AccommodationsComponent,
    TestimonialsComponent,
    GalleryComponent,
    // FavoriteToursComponent,
    CuisinesExploreComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
