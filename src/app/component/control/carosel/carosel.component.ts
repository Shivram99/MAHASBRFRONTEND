import { Component, Input } from '@angular/core';
@Component({
    selector: 'app-carosel',
    templateUrl: './carosel.component.html',
    styleUrl: './carosel.component.css',
    standalone: false
})
export class CaroselComponent {
  @Input() images: readonly string[] = [
    'assets/images/slide/img.png',
    'assets/images/slide/img2.png',
    'assets/images/slide/img3.png'
  ];

  trackByImage(_index: number, image: string): string {
    return image;
  }
}
