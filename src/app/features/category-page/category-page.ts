import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPageComponent implements OnInit {
  categoryName = signal<string>('Category');
  destinations = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('categoryId');
      if (id) {
        this.fetchCategoryData(id);
      }
    });
  }

  fetchCategoryData(categoryId: string) {
    this.loading.set(true);
    
    // 1. Fetch the category name
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (categories) => {
        const cat = categories.find(c => c.id.toString() === categoryId);
        if (cat && cat.name) {
          this.categoryName.set(cat.name);
        }
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });

    // 2. Fetch all destinations and filter by this category
    this.http.get<any[]>(`${environment.apiUrl}/tours/destinations`).subscribe({
      next: (data) => {
        const filtered = data.filter(item => item.category === categoryId);
        this.destinations.set(filtered);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch destinations', err);
        this.loading.set(false);
      }
    });
  }
}
