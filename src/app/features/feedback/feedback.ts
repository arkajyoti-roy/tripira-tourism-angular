import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule, RouterModule],
  templateUrl: './feedback.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Feedback {}
