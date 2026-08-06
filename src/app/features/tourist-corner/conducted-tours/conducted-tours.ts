import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-conducted-tours',
  imports: [CommonModule, RouterModule],
  templateUrl: './conducted-tours.html',
  styleUrl: './conducted-tours.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConductedTours {

}
