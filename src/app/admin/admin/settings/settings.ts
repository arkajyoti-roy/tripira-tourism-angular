import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings';
import { ConfirmService } from '../../services/confirm.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Password section state
  newPassword = '';
  confirmPassword = '';
  currentPassword = '';
  passwordOtp = '';
  passwordAuthMode = 'password'; // 'password' | 'otp'

  // Email section state
  newEmail = '';
  emailOtp = '';

  // Access Emails state
  accessEmails: any[] = [];
  newAccessEmail = '';

  // Common notification/loading states
  loading = false;
  message = '';
  error = '';
  
  // OTP Countdown timer
  otpSent = false;
  resendCountdown = 0;
  resendInterval: any;

  currentUserEmail = '';

  private service = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  ngOnInit() {
    this.loadAccessEmails();
    const userJson = localStorage.getItem('admin_user');
    if (userJson) {
      try {
        this.currentUserEmail = JSON.parse(userJson).email || '';
      } catch (e) {}
    }
  }

  ngOnDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  loadAccessEmails() {
    this.service.getAccessEmails().subscribe({
      next: (res: any) => {
        this.accessEmails = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load authorized access emails.';
        this.cdr.detectChanges();
      }
    });
  }

  startResendCountdown() {
    this.resendCountdown = 30;
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    this.resendInterval = setInterval(() => {
      if (this.resendCountdown > 0) {
        this.resendCountdown--;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  requestOtp() {
    this.loading = true;
    this.message = '';
    this.error = '';

    this.service.sendVerificationOtp().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.otpSent = true;
        this.message = res.message || 'OTP verification code has been sent to your current email.';
        this.startResendCountdown();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to send OTP verification code.';
        this.cdr.detectChanges();
      }
    });
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Confirm password does not match new password.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    const payload: any = {
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    if (this.passwordAuthMode === 'otp') {
      payload.otp = this.passwordOtp;
    } else {
      payload.current_password = this.currentPassword;
    }

    this.service.changePassword(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res.message || 'Password changed successfully.';
        this.newPassword = '';
        this.confirmPassword = '';
        this.currentPassword = '';
        this.passwordOtp = '';
        this.otpSent = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to update password. Verify input or OTP.';
        this.cdr.detectChanges();
      }
    });
  }

  updateEmail() {
    this.loading = true;
    this.message = '';
    this.error = '';

    const payload = {
      new_email: this.newEmail,
      otp: this.emailOtp
    };

    this.service.changeEmail(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res.message || 'Primary email updated successfully.';
        
        // Update stored user details
        if (res.user) {
          localStorage.setItem('admin_user', JSON.stringify(res.user));
        }

        this.newEmail = '';
        this.emailOtp = '';
        this.otpSent = false;
        this.loadAccessEmails();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to update email. Make sure OTP is valid.';
        this.cdr.detectChanges();
      }
    });
  }

  addAccess() {
    if (!this.newAccessEmail) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.service.addAccessEmail(this.newAccessEmail).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = 'Allowed access email added successfully.';
        this.newAccessEmail = '';
        this.loadAccessEmails();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add allowed email.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteAccess(item: any) {
    this.confirmService.confirm(`Are you sure you want to remove "${item.email}" from the authorized login list?`).then((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.message = '';
        this.error = '';

        this.service.deleteAccessEmail(item.id).subscribe({
          next: () => {
            this.loading = false;
            this.message = 'Authorized email removed successfully.';
            this.loadAccessEmails();
          },
          error: (err: any) => {
            this.loading = false;
            this.error = err.error?.message || 'Failed to delete authorized email.';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
