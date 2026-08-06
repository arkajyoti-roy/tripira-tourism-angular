import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Faq {}
