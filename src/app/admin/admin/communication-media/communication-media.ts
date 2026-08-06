import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationMediaService } from '../../services/communication-media';

@Component({
  selector: 'app-communication-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './communication-media.html',
  styleUrls: ['./communication-media.css']
})
export class CommunicationMediaComponent implements OnInit {
  phone = '';
  email = '';
  address = '';
  facebook = '';
  twitter = '';
  instagram = '';
  youtube = '';
  linkedin = '';

  loading = false;
  message = '';
  error = '';

  private service = inject(CommunicationMediaService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.service.getSettings().subscribe({
      next: (res) => {
        this.loading = false;
        const data = res?.data;
        if (data) {
          this.phone = data.phone || '';
          this.email = data.email || '';
          this.address = data.address || '';
          this.facebook = data.facebook || '';
          this.twitter = data.twitter || '';
          this.instagram = data.instagram || '';
          this.youtube = data.youtube || '';
          this.linkedin = data.linkedin || '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load communication settings.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.error = '';

    const payload = {
      phone: this.phone,
      email: this.email,
      address: this.address,
      facebook: this.facebook,
      twitter: this.twitter,
      instagram: this.instagram,
      youtube: this.youtube,
      linkedin: this.linkedin
    };

    this.service.updateSettings(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res.message || 'Communication settings saved successfully!';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to save settings.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
