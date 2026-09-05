import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-food',
  imports: [CommonModule, RouterModule],
  templateUrl: './food.html',
  styles: ``,
})
export class Food {
  foodItems = [
    { 
      name: 'Bhangui', 
      image: '/about/food/bhangui.webp',
      description: `Bhangui, a beloved traditional dish from Tripura, is a culinary treasure that embodies simplicity and authentic flavors. This delightful creation involves the gentle art of boiling sun-dried rice with the aromatic notes of ginger, the earthy richness of onion, and the subtle richness of ghee, all beautifully cocooned within a tender banana leaf. This time-honored preparation not only captivates the palate but also reflects the cultural richness of Tripura's culinary traditions.` 
    },
    { 
      name: 'Gudok', 
      image: '/about/food/gudok.webp',
      description: `Gudok, a beloved indigenous dish in Tripura, stars fermented fish (berma), beans, and potatoes—a flavorful centerpiece at community gatherings and celebrations, particularly cherished among tribal communities.`
    },
    { 
      name: 'Wahan Mosdeng', 
      image: '/about/food/borta.webp',
      description: `Wahan Mosdeng, an ancient dish from Tripura, India, has a rich history. Originally made with wild boar, it now features chicken, pork, or beef. The marination involves garlic, ginger, turmeric, and mustard oil. The meat is then grilled to perfection over charcoal, resulting in a flavorful and tender delight, showcasing Tripura's culinary heritage.`
    },
    { 
      name: 'Kosoi Bwtwi', 
      image: '/about/food/Kosoi bwtwi.webp',
      description: `Originating from the vibrant state of Tripura, the Kosoi Bwtwi Recipe is a culinary gem that highlights the region's unique flavors. This vegetarian delicacy relies on a harmonious blend of simple spices to enhance the protein-rich tofu at its heart. For an intriguing twist, many in Tripura opt to include Shrimp sauce, not only for its distinctive taste but also for its contribution to the meal's protein content, making it a versatile and delightful dish.`
    },
    { 
      name: 'Mosdeng Serma', 
      image: '/about/food/mosdeng serma.webp',
      description:`Mosdeng Serma, a cherished dish from Tripura, Northeast India, is a spicy tomato chutney. It's a perfect accompaniment to pork dishes and steamed rice. This recipe embodies the simplicity and rich flavors of the region. Soaked dry red chilies, and my personal twist of adding green chilies, infuse a delightful heat. Traditional Mosdeng Serma often includes Berma, dried fish, for an extra layer of complexity.` 
    },
    { 
      name: 'Bengali Traditional Dish', 
      image: '/about/food/food1.webp',
      description: `"Mach Bhat" is a traditional and popular dish in Tripura, a state in Northeast India. It essentially translates to "fish and rice" in English, and it's a quintessential meal in Tripuri cuisine.`
    },
    { 
      name: 'Wak BAHAN', 
      image: '/about/food/WAK BAHAN.webp',
      description: `"Wak Bahan" is a tantalizing pork delicacy hailing from the heart of Tripura, Northeast India. At its core, it celebrates the symphony of flavors and textures created by the harmonious blend of fresh bamboo shoots, fiery red chili, the subtle sweetness of papaya, and the unique twist of jackfruit. This culinary masterpiece showcases the region's rich heritage and ingenuity in transforming humble ingredients into a gastronomic delight.`
    }
  ];
}
