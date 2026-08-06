import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-credentials.html',
  styleUrls: ['./change-credentials.css']
})
export class ChangeCredentials implements OnInit {
  email = '';
  currentPassword = '';
  newPassword = '';
  otp = '';
  otpSent = false;
  
  loading = false;
  message = '';
  error = '';

  private auth = inject(AuthService);

  ngOnInit() {
    // Load current email from localstorage
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.email = user.email || '';
      } catch (e) {
        console.error(e);
      }
    }
  }

  requestOtp() {
    this.message = '';
    this.error = '';

    if (!this.email || !this.currentPassword) {
      this.error = 'Email and Current Password are required';
      return;
    }

    this.loading = true;

    this.auth.sendOtp().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.otpSent = true;
        this.message = 'An OTP code has been sent to your registered email address.';
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to send OTP code. Please check your SMTP mail settings.';
      }
    });
  }

  onSubmit() {
    if (!this.otpSent) {
      this.requestOtp();
      return;
    }

    if (!this.otp) {
      this.error = 'OTP code is required to complete the update';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    const payload: any = {
      email: this.email,
      current_password: this.currentPassword,
      otp: this.otp
    };

    if (this.newPassword) {
      payload.new_password = this.newPassword;
    }

    this.auth.changeCredentials(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.otpSent = false;
        this.otp = '';
        this.message = res.message || 'Credentials updated successfully';
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid or expired OTP code.';
      }
    });
  }

  cancelOtp() {
    this.otpSent = false;
    this.otp = '';
    this.message = '';
    this.error = '';
  }
}
