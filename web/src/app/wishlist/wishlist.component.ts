import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/enivironment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistItems: any[] = [];
  isLoading = true;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlistItems = res.wishlist || res.items || res || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/no-image.png';
    if (path.startsWith('http')) return path;
    return `${environment.mediaUrl}/${path}`;
  }

  removeFromWishlist(item: any): void {
    const productId = item.product_id || item.product?.id || item.id;
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(w => w !== item);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Removed from wishlist.',
          showConfirmButton: false,
          timer: 1800
        });
      },
      error: (err: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: err?.error?.message || 'Failed to remove.',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  moveToCart(item: any): void {
    const productId = item.product_id || item.product?.id || item.id;
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Added to cart!',
          showConfirmButton: false,
          timer: 1800
        });
      },
      error: (err: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: err?.error?.message || 'Failed to add to cart.',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
}
