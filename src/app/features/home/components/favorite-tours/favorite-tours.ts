import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorite-tours',
  imports: [CommonModule, RouterModule],
  templateUrl: './favorite-tours.html',
  styleUrl: './favorite-tours.css'
})
export class FavoriteToursComponent {
  themes = [
    { title: 'Trekking', icon: 'flaticon-hiking', color: 'text-[#2EA5FF]', hoverBg: 'hover:bg-[#2EA5FF]' },
    { title: 'JetSki', icon: 'flaticon-beach', color: 'text-[#FF4081]', hoverBg: 'hover:bg-[#FF4081]' },
    { title: 'Paragliding', icon: 'flaticon-adventure', color: 'text-[#00D6C2]', hoverBg: 'hover:bg-[#00D6C2]' },
    { title: 'HouseBoat', icon: 'flaticon-bagpack', color: 'text-[#FF9E5E]', hoverBg: 'hover:bg-[#FF9E5E]' },
    { title: 'Camping', icon: 'flaticon-tent', color: 'text-[#4461F2]', hoverBg: 'hover:bg-[#4461F2]' },
    { title: 'ParaMotoring', icon: 'flaticon-compass', color: 'text-[#26C6DA]', hoverBg: 'hover:bg-[#26C6DA]' }
  ];
}
