import { Component } from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o';;

@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
 customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoHeight: true,
    autoplay: true,
    margin:30,
    autoplayTimeout: 3000,
    autoplayHoverPause: false,
    dots: false,
     smartSpeed: 500, 
    navSpeed: 500,  
    navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2},
      740: { items: 2 },
      940: { items: 3 }
    },
    nav: true
  };
}
