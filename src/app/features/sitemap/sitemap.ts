import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  imports: [CommonModule, RouterModule],
  templateUrl: './sitemap.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sitemap {}
