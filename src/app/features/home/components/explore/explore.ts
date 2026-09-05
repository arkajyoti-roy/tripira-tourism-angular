import { Component, signal, computed, ViewEncapsulation, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../../../core/services/accessibility.service';

@Component({
  selector: 'app-explore',
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
  encapsulation: ViewEncapsulation.None
})
export class ExploreComponent implements AfterViewInit, OnDestroy {
  districts = [
    {
      id: 'west',
      name: 'West Tripura',
      desc: 'West Tripura district, situated in the state of Tripura, India, is a bustling hub of culture, commerce, and administration, with its capital city, Agartala, serving as the political and economic center of the state. The district offers a delightful blend of modern amenities and historical landmarks, including top destinations like Laxmi Narayan Temple,Kasba Kali Temple,Durga Puja,Kharchi Festival,Venuban Vihar,Khumulwng Eco Park,Gedu Mia Maszid,Chaturdash Devta Temple,Ujjayanta Palace.',
      color: '#BDB69C',
      image: '/explore-tripura/8b3f757e-8284-4f78-8e52-f6e1c7c3d575.webp'
    },
    { id: 'south', 
      name: 'South Tripura', 
      desc: 'South Tripura is a district located in the Indian state of Tripura. It is one of the eight districts of the state and is situated in the southern part of Tripura. The district is known for its diverse tribal culture, lush greenery, and serene natural beauty.There are many places are like Butterfly Park in Tripura ,Pilak Festival,Trishna Wildlife Sanctuary,Mahamuni Pegoda,Kalapania Nature Park,Pilak Archaeological Sites.',
      color: '#7A989C', 
      image: '/explore-tripura/4f45a46a-4b48-4cc9-bc74-0f7a657db9a4.webp'
    },

    { id: 'north', 
      name: 'North Tripura',
      desc: 'North Tripura, a gem in the Indian state of Tripura, boasts pristine natural beauty, lush forests, and a serene ambiance.The district invites visitors to revel in its panoramic views and flourishing ecosystems, offering a tranquil escape into nature`s embrace.Highlighted by attractions like Rowa Wildlife Sanctuary,Jampui Hill,.', 
      color: '#98B49B', 
      image: '/explore-tripura/a6f2b545-4591-41ae-855b-5b2d04c6acdf.webp' },

    { id: 'dhalai', 
      name: 'Dhalai', 
      desc: 'Dhalai district in Tripura, India, is a captivating region adorned with lush green valleys and picturesque landscapes, making it an ideal destination for nature enthusiasts and travelers seeking tranquility. The district is renowned for its diverse tribal culture and is home to several vibrant festivals that showcase the rich heritage of the indigenous communities in the area.Dhalai is a district located in the Indian state of Tripura. It is one of the eight districts of the state and is situated in the northeastern part of Tripura. The district is named after the Dhalai River, which flows through its territory.There most important places are like Dumboor Lake, Dhalai District,Sanaiya Waterfalls.', 
      color: '#7F9CB9', 
      image: '/explore-tripura/7fd464fe-3592-4a4e-9db4-faffd3de0c87.webp' },

    { id: 'gomati', 
      name: 'Gomati', 
      desc: 'Gomati Tripura is a district located in the Indian state of Tripura. It is one of the eight districts of the state and is named after the Gomati River, which flows through the district. The district is known for its picturesque landscapes, ancient temples, and rich cultural heritage. there one of the most famous places are like Bhubaneswari Temple,Chabimura,Gomati Wildlife Sanctuary,Tepania Eco Park,Gunabati Group of Temples,Diwali Festival,Tripura Sundari Temple.', 
      color: '#C2A8A4', 
      image: '/explore-tripura/a01037e8-78ab-4a13-a5e9-f344660d9151.webp' },

    { id: 'unakoti', 
      name: 'Unakoti', 
      desc: 'Unakoti, nestled in the district of the same name in Tripura, India, stands as a historical marvel. Renowned for its stunning rock-cut sculptures dating back to the 7th-9th centuries, this type of archeological place holds a unique place among the most celebrated archaeological wonders like Unakoti.', 
      color: '#B79C9C', 
      image: '/explore-tripura/38b665cc-cbec-47ba-a177-03a92b296626.webp' },
    
    { id: 'sepahijala', 
      name: 'Sepahijala', 
      desc: 'Sepahijala is a popular wildlife sanctuary located in the West Tripura district of Tripura, India. It is renowned for its diverse flora and fauna, making it a significant ecological hotspot in the region.Their most unique places are like Sepahijala Wildlife Sanctuary & Clouded Leopard National Park,Buddhist Stupa,Neermahal Water Palace.', 
      color: '#A3BCA7', 
      image: '/explore-tripura/f4330fd4-d033-4196-ad8f-88b2b963bebb.webp' },

    { id: 'khowai', 
      name: 'Khowai', 
      desc: 'Khowai in Tripura, India, named after the Khowai River, offers a picturesque retreat. Known for lush landscapes and vibrant fields, it hosts gems like Baramura Eco Park.', 
      color: '#D4AC7F', 
      image: '/explore-tripura/e7acc96a-db22-4545-9862-81d484d2c752.webp' }
  ];

  activeDistrict = signal(this.districts[0]);
  clickedDistrict = signal<string | null>(null);

  showPopup = signal<boolean>(false);
  popupTriggered = false;
  private observer: IntersectionObserver | null = null;
  private scrollTimer: any;
  private autoCloseTimer: any;

  constructor(private el: ElementRef, public accessibility: AccessibilityService) {}

  ngAfterViewInit() {
    if (sessionStorage.getItem('explorePopupShown')) {
       this.popupTriggered = true;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.popupTriggered) {
             this.scrollTimer = setTimeout(() => {
                this.showPopup.set(true);
                this.popupTriggered = true;
                sessionStorage.setItem('explorePopupShown', 'true');
                
                // Auto close after 5 seconds
                this.autoCloseTimer = setTimeout(() => {
                   this.closePopup();
                }, 5000);
             }, 1500);
          }
        } else {
           if (this.scrollTimer && !this.popupTriggered) {
              clearTimeout(this.scrollTimer);
           }
           if (this.popupTriggered && this.showPopup()) {
              this.closePopup();
           }
        }
      });
    }, { threshold: 0.5 }); // Trigger when at least 50% of the section is visible

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    clearTimeout(this.scrollTimer);
    clearTimeout(this.autoCloseTimer);
  }

  closePopup() {
    this.showPopup.set(false);
    clearTimeout(this.autoCloseTimer);
  }

  formattedDesc = computed(() => {
    const desc = this.activeDistrict().desc;
    const match = desc.match(/like\s+(.*)/i);
    if (match) {
      const places = match[1];
      const beforePlaces = desc.substring(0, match.index! + 5);
      return `${beforePlaces}<strong class="text-[#8C1C13] font-bold">${places}</strong>`;
    }
    return desc;
  });

  hoverDistrict(id: string) {
    if (this.clickedDistrict()) return;
    
    const found = this.districts.find(d => d.id === id);
    if (found) {
      this.activeDistrict.set(found);
    }
  }

  selectDistrict(id: string) {
    if (this.clickedDistrict() === id) {
      this.clickedDistrict.set(null);
    } else {
      this.clickedDistrict.set(id);
      const found = this.districts.find(d => d.id === id);
      if (found) {
        this.activeDistrict.set(found);
      }
    }
  }
}
