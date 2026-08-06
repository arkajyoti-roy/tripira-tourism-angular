import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discover',
  imports: [CommonModule, RouterModule],
  templateUrl: './discover.html',
  styleUrl: './discover.css'
})
export class DiscoverComponent {
  themes = [
    { title: 'Trekking', icon: '/trekking.svg', color: 'text-blue-500' },
    { title: 'JetSki', icon: '/surfing.svg', color: 'text-pink-500' },
    { title: 'Paragliding', icon: 'para.svg', color: 'text-teal-400' },
    { title: 'HouseBoat', icon: '/boat.svg', color: 'text-orange-400' },
    { title: 'Camping', icon: '/camping.svg', color: 'text-blue-700' },
    { title: 'ParaMotoring', icon: '/compass.svg', color: 'text-cyan-500' }
  ];
}
