import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel'
// import 'bulma-carousel'
// declare var bulmaCarousel: any;

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, ButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  @Input() items: any[] = [];
  @Input() responsiveOptions: any[] = [];
  ngAfterViewInit(): void {
    // // Initialize all elements with the 'carousel' class
    // const carousels = bulmaCarousel.attach('.carousel', {
    //   slidesToScroll: 1,
    //   slidesToShow: 3,
    // });

    // // Access specific carousel instance
    // const element = document.querySelector('#my-element');
    // if (element && (element as any).bulmaCarousel) {
    //   const instance = (element as any).bulmaCarousel;
    //   // Do something with the instance
    // }
  }
}
