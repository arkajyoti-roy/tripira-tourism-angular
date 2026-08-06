import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SmtpService } from '../../../services/smtp';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-smtp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './smtp.html',
  styleUrls: ['./smtp.css']
})
export class SmtpComponent implements OnInit {
  mail_mailer = 'smtp';
  mail_host = '';
  mail_port = 587;
  mail_username = '';
  mail_password = '';
  mail_encryption = 'tls';
  mail_from_address = '';
  mail_from_name = '';

  loading = false;
  message = '';
  error = '';

  // Multi-level confirmation flow
  showConfirmStep1 = false;
  showConfirmStep2 = false;

  private service = inject(SmtpService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.service.getSettings().subscribe({
      next: (res: any) => {
        this.mail_mailer = res.mail_mailer || 'smtp';
        this.mail_host = res.mail_host || '';
        this.mail_port = res.mail_port || 587;
        this.mail_username = res.mail_username || '';
        this.mail_password = res.mail_password || '';
        this.mail_encryption = res.mail_encryption || 'tls';
        this.mail_from_address = res.mail_from_address || '';
        this.mail_from_name = res.mail_from_name || '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load SMTP settings.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  triggerSave() {
    // Phase 1 verification alert popup
    this.confirmService.confirm('WARNING: Modifying mail server settings incorrectly can break OTP log-ins, client verification codes, and all notifications. Do you wish to continue?')
      .then((confirmed: boolean) => {
        if (confirmed) {
          // Open dynamic multi-level verification prompt step 1
          this.showConfirmStep1 = true;
          this.cdr.detectChanges();
        }
      });
  }

  confirmStep1() {
    this.showConfirmStep1 = false;
    this.showConfirmStep2 = true;
    this.cdr.detectChanges();
  }

  cancelConfirms() {
    this.showConfirmStep1 = false;
    this.showConfirmStep2 = false;
    this.cdr.detectChanges();
  }

  finalSave() {
    this.showConfirmStep2 = false;
    this.loading = true;
    this.message = '';
    this.error = '';
    this.cdr.detectChanges();

    const payload = {
      mail_mailer: this.mail_mailer,
      mail_host: this.mail_host,
      mail_port: this.mail_port,
      mail_username: this.mail_username,
      mail_password: this.mail_password,
      mail_encryption: this.mail_encryption,
      mail_from_address: this.mail_from_address,
      mail_from_name: this.mail_from_name
    };

    this.service.updateSettings(payload).subscribe({
      next: (res: any) => {
        this.message = res.message || 'SMTP settings updated successfully.';
        this.loading = false;
        this.cdr.detectChanges();
        // Return to settings after brief delay
        setTimeout(() => {
          this.router.navigate(['/admin/settings']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to update SMTP configurations.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
