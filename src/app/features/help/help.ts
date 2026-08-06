import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  imports: [CommonModule, RouterModule],
  templateUrl: './help.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Help {}
