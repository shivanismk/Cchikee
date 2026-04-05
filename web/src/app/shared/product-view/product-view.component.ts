import { Component, Input, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '../../../environments/enivironment';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import Swal from 'sweetalert2';
declare var $: any;
declare var lightbox: any;
@Component({
  selector: 'app-product-view',
  standalone: false,
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnChanges {
  owlElement:any;
  mainImage: string = 'assets/images/no-image.png';
  quantity: number = 1;
  selectedSize: string = '';
  @Input() owlCarouselId: String = "";
  @Input() product: any = null;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    if (!this.product) return;
    if (!this.selectedSize) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Please select a size.',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    this.cartService.addToCart(this.product.id, this.quantity, this.selectedSize).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `"${this.product.name}" added to cart!`,
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

  addToWishlist(): void {
    if (!this.product) return;
    this.wishlistService.addToWishlist(this.product.id).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `"${this.product.name}" added to wishlist!`,
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
          title: err?.error?.message || 'Failed to add to wishlist.',
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  setMainImage(image: string) {
    this.mainImage = image;
  }

  getImageUrl(path: string): string {
    return `${environment.mediaUrl}/${path}`;
  }

  ngOnChanges(): void {
    if (this.product?.images?.length) {
      this.mainImage = this.getImageUrl(this.product.images[0].image_url);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.owlElement?.refresh();
      }, 200);
    }
  }

 customOptions3: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoHeight: true,
    autoplay: true,
    margin:30,
    autoplayTimeout: 10000,
    autoplayHoverPause: false,
    dots: false,
    smartSpeed: 3000, 
    navSpeed: 3000, 
    navText: [''],
    responsive: {
      0: { items: 2 },
      400: { items: 3 },
      740: { items: 3 },
      940: { items: 3 }
    },
    nav: false
  };
}
