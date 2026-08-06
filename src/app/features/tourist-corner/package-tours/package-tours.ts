import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-package-tours',
  imports: [CommonModule, RouterModule],
  templateUrl: './package-tours.html',
  styleUrl: './package-tours.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageTours {

}
