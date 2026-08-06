import { Component, ChangeDetectionStrategy, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adventure',
  imports: [CommonModule, RouterModule],
  templateUrl: './adventure.html',
  styleUrl: './adventure.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Adventure implements OnInit {
  adventures = signal<any[]>([]);
  adventureTypes = signal<string[]>([]);
  groupedAdventures = signal<{[key: string]: any[]}>({});
  selectedType = signal<string | null>(null);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedType.set(params['type']);
      }
    });
  }

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/adventures`).subscribe({
      next: (data) => {
        const storageBase = environment.apiUrl.replace('/api/public', '/storage');
        
        this.adventures.set(data);
        
        const types = new Set<string>();
        const grouped: {[key: string]: any[]} = {};
        
        data.forEach(adv => {
          const type = adv.adventure_type || 'Other';
          types.add(type);
          if (!grouped[type]) {
            grouped[type] = [];
          }
          grouped[type].push(adv);
        });
        
        this.adventureTypes.set(Array.from(types));
        this.groupedAdventures.set(grouped);
      },
      error: (err) => {
        console.error("Failed to fetch adventures", err);
      }
    });
  }

  selectType(type: string | null) {
    this.selectedType.set(type);
  }
}
