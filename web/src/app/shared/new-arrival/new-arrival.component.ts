import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/enivironment';

@Component({
  selector: 'app-new-arrival',
  standalone: false,
  templateUrl: './new-arrival.component.html',
  styleUrl: './new-arrival.component.css'
})
export class NewArrivalComponent implements OnInit {
  newArrivals: any[] = [];
  mediaUrl = environment.mediaUrl;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getNewArrivals().subscribe((res: any) => {
      this.newArrivals = res.products || res;
    });
  }

  getImageUrl(path: string): string {
    return `${this.mediaUrl}/${path}`;
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoHeight: true,
    autoplay: true,
    margin:30,
    autoplayTimeout: 5000,
    autoplayHoverPause: false,
    dots: false,
     smartSpeed: 1000, 
    navSpeed: 500,  
    navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  };
}
