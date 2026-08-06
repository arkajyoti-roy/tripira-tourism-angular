import { Component, inject, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, AfterViewInit, OnDestroy {
  email = '';
  password = '';
  otp = '';
  loginMethod = 'password'; // 'password' | 'otp'
  otpSent = false;
  
  error = '';
  message = '';
  loading = false;

  resendCountdown = 0;
  resendInterval: any;

  @ViewChild('bgVideo') videoElement!: ElementRef<HTMLVideoElement>;

  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.videoElement && this.videoElement.nativeElement) {
      // Play video in slow motion (0.5x speed)
      this.videoElement.nativeElement.playbackRate = 0.55;
    }
  }

  ngOnDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  setLoginMethod(method: string) {
    this.loginMethod = method;
    this.error = '';
    this.message = '';
    this.otpSent = false;
    this.otp = '';
    this.resendCountdown = 0;
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    this.cdr.detectChanges();
  }

  startResendCountdown() {
    this.resendCountdown = 20;
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

  sendOtp() {
    if (!this.email) {
      this.error = 'Email address is required to request an OTP code.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.auth.sendLoginOtp(this.email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.otpSent = true;
        this.message = res.message || 'OTP verification code has been sent to your email.';
        this.startResendCountdown();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to send OTP code. Please verify email and setup.';
        this.cdr.detectChanges();
      }
    });
  }

  resendOtp() {
    this.sendOtp();
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.message = '';

    const payload: any = { email: this.email };
    if (this.loginMethod === 'otp') {
      if (!this.otpSent) {
        this.sendOtp();
        return;
      }
      payload.otp = this.otp;
    } else {
      payload.password = this.password;
    }

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid login credentials.';
        this.cdr.detectChanges();
      }
    });
  }
}
