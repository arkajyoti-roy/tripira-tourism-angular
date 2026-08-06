import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicy {}
