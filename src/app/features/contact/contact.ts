import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  fax: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, RouterModule],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  contacts = signal<Contact[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/contact`)
      .subscribe({
        next: (res) => {
          let contactData: Contact[] = [];
          if (res && res.data) {
             contactData = Array.isArray(res.data) ? res.data : [res.data];
          } else if (res) {
             contactData = Array.isArray(res) ? res : [res];
          }
          this.contacts.set(contactData);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching contact info', err);
          this.error.set('Failed to load contact information.');
          this.loading.set(false);
        }
      });
  }
}
