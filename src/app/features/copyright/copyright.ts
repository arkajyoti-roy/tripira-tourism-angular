import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-copyright',
  imports: [CommonModule, RouterModule],
  templateUrl: './copyright.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Copyright {}
