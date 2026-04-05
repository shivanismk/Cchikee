import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/enivironment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  isLoading = true;
  subtotal = 0;
  tax = 0;
  total = 0;
  readonly TAX_RATE = 0.085;
  readonly PICKUP_FEE = 5;

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.cart || res.items || res || [];
        this.calculateTotals();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/no-image.png';
    if (path.startsWith('http')) return path;
    return `${environment.mediaUrl}/${path}`;
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * (item.quantity || 1);
    }, 0);
    this.tax = this.subtotal * this.TAX_RATE;
    this.total = this.subtotal + this.tax + this.PICKUP_FEE;
  }

  updateQuantity(item: any, delta: number): void {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    this.cartService.updateCartItem(item.id, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        this.calculateTotals();
      },
      error: (err: any) => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'error',
          title: err?.error?.message || 'Failed to update quantity.',
          showConfirmButton: false, timer: 2000 });
      }
    });
  }

  removeItem(item: any): void {
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(c => c !== item);
        this.calculateTotals();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success',
          title: 'Item removed from cart.', showConfirmButton: false, timer: 1800 });
      },
      error: (err: any) => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'error',
          title: err?.error?.message || 'Failed to remove item.',
          showConfirmButton: false, timer: 2000 });
      }
    });
  }
}
