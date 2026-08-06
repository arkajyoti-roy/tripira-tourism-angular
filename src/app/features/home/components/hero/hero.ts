import { Component, ChangeDetectionStrategy } from '@angular/core';
// import { RouterLink } from "@angular/router";
// import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [RouterLink]
})
export class HeroComponent {}
