import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/enivironment';

declare var $: any;

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
owlElement:any;
parentCategories: any[] = [];
trendingProducts: any[] = [];
activeCategoryId: number | null = null;

constructor(
  private categoryService: CategoryService,
  private productService: ProductService,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }
    this.loadParentCategories();
  }

getImageUrl(path: string): string {
  return `${environment.mediaUrl}/${path}`;
}

loadParentCategories(): void {
  this.categoryService.getParentCategories().subscribe((res: any) => {
    const all = res.categories || res;
    this.parentCategories = all.filter((cat: any) => !cat.parent_id);
    if (this.parentCategories.length) {
      this.loadTrendingProducts(this.parentCategories[0].id);
    }
  });
}

loadTrendingProducts(categoryId: number): void {
  this.activeCategoryId = categoryId;
  this.productService.getTrendingProducts(categoryId).subscribe((res: any) => {
    this.trendingProducts = res.products || res;
  });
}
ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      $('#productModal').on('shown.bs.modal', () => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }

  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoHeight: true,
    autoplay: true,
    margin:30,
    autoplayTimeout: 7000,
    autoplayHoverPause: false,
    dots: false,
    smartSpeed: 3000, 
    navSpeed: 3000, 
    navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  };
  
  customOptions1: OwlOptions = {
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
      940: { items: 3 }
    },
    nav: true
  };
  
   
  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoHeight: true,
    autoplay: true,
    margin:5,
    autoplayTimeout: 7000,
    autoplayHoverPause: false,
    dots: false,
    smartSpeed: 3000, 
    navSpeed: 3000, 
    navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 }
    },
    nav: true
  };
}  
