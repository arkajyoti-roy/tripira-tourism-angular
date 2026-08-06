import { Routes } from '@angular/router';
import { AuthGuard } from './admin/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home), data: { seo: { title: 'Home', description: 'Official website of Tripura Tourism. Explore top destinations, vibrant culture, exciting festivals, and book luxury accommodations in Tripura.', url: '/' } } },
  { path: 'destinations', loadComponent: () => import('./features/destinations-page/destinations-page').then(m => m.DestinationsPageComponent), data: { seo: { title: 'Destinations', description: 'Discover top tourist destinations in Tripura including Agartala, Udaipur, Unakoti, Neermahal, and Jampui Hills.', url: '/destinations' } } },
  { path: 'best-packages', loadComponent: () => import('./features/best-packages/best-packages').then(m => m.BestPackages), data: { seo: { title: 'Tour Packages', description: 'Browse and book the best tour packages in Tripura for families, solo travelers, and adventure enthusiasts.', url: '/best-packages' } } },
  { path: 'privacy-policy', loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy), data: { seo: { title: 'Privacy Policy', description: 'Privacy policy for Tripura Tourism official website.', url: '/privacy-policy' } } },
  { path: 'help', loadComponent: () => import('./features/help/help').then(m => m.Help), data: { seo: { title: 'Help & Support', description: 'Get help and support for your travels in Tripura.', url: '/help' } } },
  { path: 'copyright', loadComponent: () => import('./features/copyright/copyright').then(m => m.Copyright) },
  { path: 'disclaimer', loadComponent: () => import('./features/disclaimer/disclaimer').then(m => m.Disclaimer) },
  { path: 'sitemap', loadComponent: () => import('./features/sitemap/sitemap').then(m => m.Sitemap) },
  { path: 'feedback', loadComponent: () => import('./features/feedback/feedback').then(m => m.Feedback), data: { seo: { title: 'Feedback', description: 'Provide feedback to Tripura Tourism to help us improve your experience.', url: '/feedback' } } },
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.ContactComponent), data: { seo: { title: 'Contact Us', description: 'Contact Tripura Tourism for inquiries, bookings, and travel assistance.', url: '/contact' } } },
  
  // About Routes
  { path: 'about/history', loadComponent: () => import('./features/about/history/history').then(m => m.History), data: { seo: { title: 'History of Tripura', description: 'Learn about the rich ancient history and royal heritage of Tripura.', url: '/about/history' } } },
  { path: 'about/geography', loadComponent: () => import('./features/about/geography/geography').then(m => m.Geography), data: { seo: { title: 'Geography & Climate', description: 'Explore the geographical diversity and climate of Tripura.', url: '/about/geography' } } },
  { path: 'about/state-symbol', loadComponent: () => import('./features/about/state-symbol/state-symbol').then(m => m.StateSymbol), data: { seo: { title: 'State Symbols', description: 'Discover the official state symbols of Tripura.', url: '/about/state-symbol' } } },
  { path: 'about/how-to-reach', loadComponent: () => import('./features/about/how-to-reach/how-to-reach').then(m => m.HowToReach), data: { seo: { title: 'How to Reach Tripura', description: 'Find out how to reach Tripura by air, train, and road from major Indian cities.', url: '/about/how-to-reach' } } },
  { path: 'about/culture', loadComponent: () => import('./features/about/culture/culture').then(m => m.Culture), data: { seo: { title: 'Culture & Heritage', description: 'Experience the diverse tribal culture, arts, and heritage of Tripura.', url: '/about/culture' } } },
  { path: 'about/festivals', loadComponent: () => import('./features/about/festivals/festivals').then(m => m.Festivals), data: { seo: { title: 'Festivals of Tripura', description: 'Join the vibrant festivals of Tripura including Kharchi Puja, Garia Puja, and Neermahal Festival.', url: '/about/festivals' } } },
  { path: 'about/food', loadComponent: () => import('./features/about/food/food').then(m => m.Food), data: { seo: { title: 'Cuisines of Tripura', description: 'Taste the unique traditional cuisines and local delicacies of Tripura.', url: '/about/food' } } },
  { path: 'about/rabindranath', loadComponent: () => import('./features/about/rabindranath/rabindranath').then(m => m.Rabindranath), data: { seo: { title: 'Rabindranath Tagore & Tripura', description: 'Explore the deep connection between Rabindranath Tagore and the Royal family of Tripura.', url: '/about/rabindranath' } } },
  { path: 'about/sd-burman', loadComponent: () => import('./features/about/sd-burman/sd-burman').then(m => m.SdBurman), data: { seo: { title: 'S.D. Burman', description: 'Learn about the legendary music maestro Sachin Dev Burman and his roots in Tripura.', url: '/about/sd-burman' } } },
  
  // Accommodation Routes
  { path: 'accommodation/under-ttdcl', loadComponent: () => import('./features/accommodation/under-ttdcl/under-ttdcl').then(m => m.UnderTtdcl), data: { seo: { title: 'TTDCL Hotels', description: 'Book government tourist lodges and hotels managed by TTDCL across Tripura.', url: '/accommodation/under-ttdcl' } } },
  { path: 'accommodation/registered-private-hotels', loadComponent: () => import('./features/accommodation/registered-private-hotels/registered-private-hotels').then(m => m.RegisteredPrivateHotels), data: { seo: { title: 'Private Hotels', description: 'Find registered private hotels, resorts, and lodges in Tripura.', url: '/accommodation/registered-private-hotels' } } },
  { path: 'accommodation/leaseout-ttdcl', loadComponent: () => import('./features/accommodation/leaseout-ttdcl/leaseout-ttdcl').then(m => m.LeaseoutTtdcl), data: { seo: { title: 'Leased Out TTDCL Properties', description: 'Information on leased out TTDCL properties in Tripura.', url: '/accommodation/leaseout-ttdcl' } } },
  { path: 'accommodation/homestays', loadComponent: () => import('./features/accommodation/homestays/homestays').then(m => m.Homestays), data: { seo: { title: 'Homestays in Tripura', description: 'Experience authentic local life by booking registered homestays in Tripura.', url: '/accommodation/homestays' } } },
  
  // Galleries
  { path: 'galleries/photo', loadComponent: () => import('./features/galleries/photo-galleries/photo-galleries').then(m => m.PhotoGalleries), data: { seo: { title: 'Photo Gallery', description: 'View beautiful photos of Tripura tourist destinations, culture, and festivals.', url: '/galleries/photo' } } },
  { path: 'galleries/video', loadComponent: () => import('./features/galleries/video-galleries/video-galleries').then(m => m.VideoGalleries), data: { seo: { title: 'Video Gallery', description: 'Watch videos showcasing the scenic beauty and heritage of Tripura.', url: '/galleries/video' } } },
  
  // Tour & Adventure
  { path: 'adventure', loadComponent: () => import('./features/adventure/adventure').then(m => m.Adventure), data: { seo: { title: 'Adventure Tourism', description: 'Experience thrilling adventure sports, trekking, and water sports in Tripura.', url: '/adventure' } } },
  { path: 'tour/:id', loadComponent: () => import('./features/tour/tour').then(m => m.Tour) }, // SEO handled dynamically in component
  { path: 'category/:categoryId', loadComponent: () => import('./features/category-page/category-page').then(m => m.CategoryPageComponent) }, // SEO handled dynamically in component
  
  // Tourist Corner
  { path: 'tourist-corner/package-tours', loadComponent: () => import('./features/tourist-corner/package-tours/package-tours').then(m => m.PackageTours), data: { seo: { title: 'Package Tours', description: 'Browse available package tours offered by Tripura Tourism.', url: '/tourist-corner/package-tours' } } },
  { path: 'tourist-corner/conducted-tours', loadComponent: () => import('./features/tourist-corner/conducted-tours/conducted-tours').then(m => m.ConductedTours), data: { seo: { title: 'Conducted Tours', description: 'Details about guided conducted tours in Tripura.', url: '/tourist-corner/conducted-tours' } } },
  { path: 'tourist-corner/guidelines', loadComponent: () => import('./features/tourist-corner/guidelines/guidelines').then(m => m.Guidelines), data: { seo: { title: 'Tourist Guidelines', description: 'Important guidelines and tips for tourists visiting Tripura.', url: '/tourist-corner/guidelines' } } },
  { path: 'tourist-corner/acts-and-rules', loadComponent: () => import('./features/tourist-corner/acts-and-rules/acts-and-rules').then(m => m.ActsAndRules) },
  { path: 'tourist-corner/brochure', loadComponent: () => import('./features/tourist-corner/brochure/brochure').then(m => m.Brochure), data: { seo: { title: 'Tourism Brochures', description: 'Download official Tripura Tourism brochures and maps.', url: '/tourist-corner/brochure' } } },
  { path: 'tourist-corner/tourist-guide', loadComponent: () => import('./features/tourist-corner/tourist-guide/tourist-guide').then(m => m.TouristGuide), data: { seo: { title: 'Tourist Guides', description: 'Find registered and certified tourist guides in Tripura.', url: '/tourist-corner/tourist-guide' } } },
  { path: 'tourist-corner/downloadable-forms', loadComponent: () => import('./features/tourist-corner/downloadable-forms/downloadable-forms').then(m => m.DownloadableForms) },
  { path: 'tourist-corner/tour-operators', loadComponent: () => import('./features/tourist-corner/tour-operators/tour-operators').then(m => m.TourOperators), data: { seo: { title: 'Tour Operators', description: 'List of registered tour operators and travel agencies in Tripura.', url: '/tourist-corner/tour-operators' } } },
  { path: 'tourist-corner/publications', loadComponent: () => import('./features/tourist-corner/publications/publications').then(m => m.Publications) },
  
  // Dept Info
  { path: 'dept-info/notifications', loadComponent: () => import('./features/dept-info/notifications/notifications').then(m => m.Notifications) },
  { path: 'dept-info/tender', loadComponent: () => import('./features/dept-info/tender/tender').then(m => m.Tender) },
  { path: 'dept-info/establishment/sihm', loadComponent: () => import('./features/dept-info/establishment/sihm/sihm').then(m => m.Sihm) },
  { path: 'dept-info/establishment/tsm', loadComponent: () => import('./features/dept-info/establishment/tsm/tsm').then(m => m.Tsm) },
  { path: 'dept-info/policy', loadComponent: () => import('./features/dept-info/policy/policy').then(m => m.Policy) },
  { path: 'dept-info/recruitment', loadComponent: () => import('./features/dept-info/recruitment/recruitment').then(m => m.Recruitment) },
  { path: 'dept-info/ongoing-projects', loadComponent: () => import('./features/dept-info/ongoing-projects/ongoing-projects').then(m => m.OngoingProjects) },
  { path: 'dept-info/who-is-who', loadComponent: () => import('./features/dept-info/who-is-who/who-is-who').then(m => m.WhoIsWho) },
  { path: 'faq', loadComponent: () => import('./features/faq/faq').then(m => m.Faq), data: { seo: { title: 'FAQ', description: 'Frequently asked questions about visiting Tripura.', url: '/faq' } } },
  
  // Admin Routes
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/login', loadComponent: () => import('./admin/login/login').then(m => m.Login) },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/admin/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'tourist-category', loadComponent: () => import('./admin/admin/tourist-category/tourist-category').then(m => m.TouristCategory) },
      { path: 'tour', loadComponent: () => import('./admin/admin/tour/tour').then(m => m.Tour) },
      { path: 'adventures', loadComponent: () => import('./admin/admin/adventure/adventure').then(m => m.Adventure) },
      { path: 'accommodation', loadComponent: () => import('./admin/admin/accommodation/accommodation').then(m => m.Accommodation) },
      { path: 'directorate', loadComponent: () => import('./admin/admin/directorate/directorate').then(m => m.Directorate) },
      { path: 'development-corporation', loadComponent: () => import('./admin/admin/devcorp/devcorp').then(m => m.Devcorp) },
      { path: 'guides', loadComponent: () => import('./admin/admin/guide/guide').then(m => m.Guide) },
      { path: 'agents', loadComponent: () => import('./admin/admin/agents/agents').then(m => m.Agents) },
      { path: 'video-galleries', loadComponent: () => import('./admin/admin/video-gallery/video-gallery').then(m => m.VideoGallery) },
      { path: 'photo-galleries', loadComponent: () => import('./admin/admin/photo-gallery/photo-gallery').then(m => m.PhotoGallery) },
      { path: 'contact', loadComponent: () => import('./admin/admin/contact/contact').then(m => m.Contact) },
      { path: 'communication-media', loadComponent: () => import('./admin/admin/communication-media/communication-media').then(m => m.CommunicationMediaComponent) },
      { path: 'documents', loadComponent: () => import('./admin/admin/documents/documents').then(m => m.Documents) },
      { path: 'testimonials', loadComponent: () => import('./admin/admin/testimonials/testimonials').then(m => m.TestimonialsComponent) },
      { path: 'settings', loadComponent: () => import('./admin/admin/settings/settings').then(m => m.SettingsComponent) },
      { path: 'settings/smtp', loadComponent: () => import('./admin/admin/settings/smtp/smtp').then(m => m.SmtpComponent) },
      { path: 'logs', loadComponent: () => import('./admin/admin/activity-logs/activity-logs').then(m => m.ActivityLogs) }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
