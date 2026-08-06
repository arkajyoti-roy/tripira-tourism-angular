import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-cuisines-explore',
  imports: [CommonModule, RouterModule],
  templateUrl: './cuisines-explore.html',
  styleUrl: './cuisines-explore.css'
})
export class CuisinesExploreComponent {
  cuisines = [
     {
      name: 'GUDOK',
      image: '/about/food/gudok-remove4.png',
      description: "One of the special dishes from Tripura, it is a stew that's made by boiling vegetables and fermented fish."
    },
    {
      name: 'KOSOI BWTWI',
      image: '/about/food/Kosoi bwtwi2.png',
      description: ' Kosoi Bwtwi’ is a traditional Tripuri dish made with bamboo shoots and fermented fish.'
    },
    {
      name: 'WAK BAHAN',
      image: '/about/food/b110e749-7fad-4f6a-88b1-549c4acba0ca-removebg-preview11.png',
      description: 'A Pork Dish made of jackfruit, bamboo shoots, papaya and red chilli.'
    },
   
    {
      name: 'MACH BATH',
      image: '/about/food/31e56dce-936f-4197-a150-b4f1a369646c-removebg-preview.png',
      description: 'Bengalis in Tripura commonly indulge in a widely popular meal comprising of Fish Curry, Rice, Fry, and Lentil.'
    }
  ];
}
