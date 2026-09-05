import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultTitle = 'Tripura Tourism';
  private defaultDescription = 'Official website of Tripura Tourism. Explore destinations, culture, festivals, and book accommodations in Tripura.';
  private defaultKeywords = 'Tripura Tourism, Travel, North East India, Agartala, Tourism, Holiday, Vacation, Accommodations, Heritage, tourist India, tourist places of India, Tourist attractions of india, beautiful places to visit in India, tourist northeast, tourist places of tripura, Tourist attractions of tripura, beautiful places to visit in tripura, tripura travel guide, tripura tourism government, unakoti hills, neermahal water palace, chabimura, pilak, jampui hills, tripurasundari temple matabari, north east india tour packages, travel to tripura, tripura destination guide';
  private defaultImage = 'https://tripuratourism.gov.in/tripuratourismlogo.webp';
  
  constructor(
    private titleService: Title, 
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  updateTags(config: SeoConfig = {}) {
    // 1. Set Title
    const title = config.title ? `${config.title} | Tripura Tourism` : this.defaultTitle;
    this.titleService.setTitle(title);

    // 2. Set Meta Description
    const description = config.description || this.defaultDescription;
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Set Keywords
    const keywords = config.keywords || this.defaultKeywords;
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // 4. Set Robots
    const robots = config.robots || 'index, follow';
    this.metaService.updateTag({ name: 'robots', content: robots });

    // 5. Open Graph (Facebook/LinkedIn)
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Tripura Tourism' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: config.image || this.defaultImage });
    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
      this.setCanonicalUrl(config.url);
    } else if (isPlatformBrowser(this.platformId)) {
      this.metaService.updateTag({ property: 'og:url', content: window.location.href });
      this.setCanonicalUrl(window.location.href);
    }

    // 6. Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.image || this.defaultImage });

    // 7. Inject Schema.org JSON-LD Structured Data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      'name': 'Tripura Tourism',
      'url': 'https://tripuratourism.gov.in',
      'logo': 'https://tripuratourism.gov.in/tripuratourismlogo.webp',
      'sameAs': [
        'https://www.facebook.com/www.tripuratourism.gov.in/',
        'https://www.instagram.com/tourism.tripura/'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-381-2325930',
        'contactType': 'customer service'
      }
    };
    this.setJsonLd(config.type === 'Attraction' ? this.buildAttractionSchema(config) : defaultSchema);
  }

  setCanonicalUrl(url: string) {
    let head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.dom.querySelector(`link[rel='canonical']`) || null;
    
    if (element === null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    
    // Ensure the URL is absolute
    const finalUrl = url.startsWith('http') ? url : `https://tripuratourism.gov.in${url.startsWith('/') ? url : '/' + url}`;
    element.setAttribute('href', finalUrl);
  }

  setJsonLd(schema: any) {
    let head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLScriptElement | null = this.dom.querySelector(`script[type='application/ld+json']`) || null;
    
    if (element === null) {
      element = this.dom.createElement('script') as HTMLScriptElement;
      element.setAttribute('type', 'application/ld+json');
      head.appendChild(element);
    }
    
    element.textContent = JSON.stringify(schema);
  }

  private buildAttractionSchema(config: SeoConfig) {
    return {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      'name': config.title || 'Tourist Attraction',
      'description': config.description || '',
      'image': config.image || this.defaultImage,
      'url': config.url ? (config.url.startsWith('http') ? config.url : `https://tripuratourism.gov.in${config.url}`) : 'https://tripuratourism.gov.in'
    };
  }
}
