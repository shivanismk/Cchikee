import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/enivironment';
import Swal from 'sweetalert2';
declare var $ : any
@Component({
  selector: 'app-category-page',
  standalone: false,
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent {
  products:any[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }
    this.getProducts();
  }

  showfilter(){
    if (isPlatformBrowser(this.platformId)) $('#filtersidebar').addClass('active');
  }

  hidefilter(){
    if (isPlatformBrowser(this.platformId)) $('#filtersidebar').removeClass('active');
  }

getImageUrl(path: string): string {
  return `${environment.mediaUrl}/${path}`;
}

getProducts(){
  this.productService.getProducts().subscribe((res:any)=>{
    this.products = res.products;
  })
}

addToCart(product: any): void {
  this.cartService.addToCart(product.id, 1).subscribe({
    next: () => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `"${product.name}" added to cart!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    },
    error: (err: any) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err?.error?.message || 'Failed to add to cart.',
        showConfirmButton: false,
        timer: 2500
      });
    }
  });
}

}
