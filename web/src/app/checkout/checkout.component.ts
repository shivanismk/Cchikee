import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { environment } from '../../environments/enivironment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems: any[] = [];
  isLoading = true;
  isPlacingOrder = false;
  selectedPayment = 'cod';

  readonly TAX_RATE = 0.085;
  readonly PICKUP_FEE = 5;

  form = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
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
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.cart || res.items || res || [];
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

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  }

  get tax(): number { return this.subtotal * this.TAX_RATE; }

  get total(): number { return this.subtotal + this.tax + this.PICKUP_FEE; }

  placeOrder(): void {
    if (!this.form.first_name || !this.form.last_name || !this.form.email || !this.form.phone || !this.form.address || !this.form.city || !this.form.state || !this.form.zip_code) {
      Swal.fire({ icon: 'warning', title: 'Missing Details', text: 'Please fill in all required shipping fields.' });
      return;
    }
    if (this.cartItems.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Empty Cart', text: 'Your cart is empty.' });
      return;
    }

    this.isPlacingOrder = true;
    const orderData = {
      first_name: this.form.first_name,
      last_name: this.form.last_name,
      email: this.form.email,
      phone: this.form.phone,
      address: this.form.address,
      city: this.form.city,
      state: this.form.state,
      zip_code: this.form.zip_code,
      payment_method: this.selectedPayment,
      total_amount: this.total
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: (res: any) => {
        this.isPlacingOrder = false;
        const orderId = res?.order?.id || res?.id || res?.order_id || '';
        Swal.fire({
          title: 'Order Confirmed!',
          html: `Your order has been placed successfully.<br><strong>Order ID: #${orderId}</strong>`,
          icon: 'success',
          confirmButtonText: 'View Orders'
        }).then(() => this.router.navigate(['/dashboard']));
      },
      error: (err: any) => {
        this.isPlacingOrder = false;
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: err?.error?.message || 'Something went wrong. Please try again.'
        });
      }
    });
  }
}
