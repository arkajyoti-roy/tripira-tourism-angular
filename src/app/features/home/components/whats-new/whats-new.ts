import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface DocumentItem {
  docid: number;
  des: string;
  openDate: string;
  closeDate: string;
  status: number;
  updateDate: string | null;
  file: string;
  doctype: number;
  whatsnew: number;
  file_url: string;
}

export interface NoticeItem {
  id: number;
  file: string;
  date: string;
  title: string;
  file_url: string;
}

export interface WhatsNewResponse {
  documents?: DocumentItem[];
  notices?: NoticeItem[];
}

export interface MarqueeItem {
  title: string;
  url: string;
  isNew: boolean;
}

@Component({
  selector: 'app-whats-new',
  imports: [CommonModule],
  templateUrl: './whats-new.html',
  styleUrl: './whats-new.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsNewComponent implements OnInit {
  items = signal<MarqueeItem[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<WhatsNewResponse>(`${environment.apiUrl}/whats-new`).subscribe({
      next: (data) => {
        const combined: MarqueeItem[] = [];
        
        if (data.notices) {
          data.notices.forEach(n => {
            combined.push({ title: n.title, url: n.file_url, isNew: true });
          });
        }
        
        if (data.documents) {
          data.documents.forEach(d => {
            combined.push({ title: d.des, url: d.file_url, isNew: d.whatsnew === 1 });
          });
        }
        
        this.items.set(combined);
      },
      error: (err) => {
        console.error('Failed to fetch whats-new data', err);
      }
    });
  }
}
