import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  imports: [CommonModule, RouterModule],
  templateUrl: './disclaimer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Disclaimer {}
