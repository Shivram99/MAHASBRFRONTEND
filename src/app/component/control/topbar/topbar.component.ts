import { Component, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css',
    standalone: false
})
export class TopbarComponent {
 emblemImg : string = 'assets/images/emblem.png';

 isLoggedIn: boolean = false;
private currentSize = 14;
  private intervalId: any;

  constructor(private renderer: Renderer2) {}
 
  private animateFontSize(targetSize: number): void {
    const step = targetSize > this.currentSize ? 1 : -1;

    // Clear any previous animation
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      if (this.currentSize === targetSize) {
        clearInterval(this.intervalId);
      } else {
        this.currentSize += step;
        this.renderer.setStyle(document.body, 'font-size', `${this.currentSize}px`);
      }
    }, 80);
  }

  changeFontSize(type: 'small' | 'medium' | 'large'): void {
    let newSize = 14;
    if (type === 'small') newSize = 12;
    if (type === 'large') newSize = 16;
    this.animateFontSize(newSize);
  }
  
   private colorThemes = ['normal', 'deuteranopia', 'protanopia', 'high-contrast'];

  

  setTheme(theme: string): void {
    if (!this.colorThemes.includes(theme)) theme = 'normal';
    this.colorThemes.forEach(t => this.renderer.removeClass(document.body, t));
    this.renderer.addClass(document.body, theme);
    localStorage.setItem('colorTheme', theme);
  }

  loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('colorTheme') || 'normal';
    this.setTheme(savedTheme);
  }
}
