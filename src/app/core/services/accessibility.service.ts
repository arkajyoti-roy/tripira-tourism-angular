import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  fontSize = signal<'normal' | 'large' | 'small'>('normal');
  theme = signal<'default' | 'dark' | 'white' | 'blue' | 'yellow'>('default');

  constructor() {
    // Apply font size and theme effects on state change
    effect(() => {
      this.applyFontSize(this.fontSize());
      this.applyTheme(this.theme());
    });
  }

  setFontSize(size: 'normal' | 'large' | 'small') {
    this.fontSize.set(size);
  }

  setTheme(theme: 'default' | 'dark' | 'white' | 'blue' | 'yellow') {
    this.theme.set(theme);
  }

  private applyFontSize(size: string) {
    const root = document.documentElement;
    if (size === 'large') {
      root.style.fontSize = '18px';
    } else if (size === 'small') {
      root.style.fontSize = '14px';
    } else {
      root.style.fontSize = '16px';
    }
  }

  private applyTheme(theme: string) {
    const body = document.body;
    body.classList.remove('theme-dark', 'theme-white', 'theme-blue', 'theme-yellow');
    
    if (theme === 'dark') {
      body.classList.add('theme-dark');
      body.style.backgroundColor = '#121212';
      body.style.color = '#ffffff';
    } else if (theme === 'white') {
      body.classList.add('theme-white');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#000000';
    } else if (theme === 'blue') {
      body.classList.add('theme-blue');
      body.style.backgroundColor = '#0B192C';
      body.style.color = '#ffffff';
    } else if (theme === 'yellow') {
      body.classList.add('theme-yellow');
      body.style.backgroundColor = '#fef08a'; /* Light yellow */
      body.style.color = '#000000';
    } else {
      // default
      body.style.backgroundColor = '';
      body.style.color = '';
    }
  }
}
