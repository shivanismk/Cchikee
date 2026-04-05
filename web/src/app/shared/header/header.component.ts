import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/enivironment';
declare var $: any;
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  categories: any[] = [];
  wishlistCount: number = 0;
  cartCount: number = 0;

  constructor(
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  cartItems: any[] = [];
  cartLoading = false;

  ngOnInit(): void {
    this.getCategories();
    this.wishlistService.fetchCount();
    this.wishlistService.wishlistCount.subscribe(count => this.wishlistCount = count);
    this.cartService.fetchCount();
    this.cartService.cartCount.subscribe(count => {
      this.cartCount = count;
      this.loadCartItems();
    });
  }

  loadCartItems(): void {
    this.cartLoading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.cart || res.items || res || [];
        this.cartLoading = false;
      },
      error: () => { this.cartLoading = false; }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/no-image.png';
    if (path.startsWith('http')) return path;
    return `${environment.mediaUrl}/${path}`;
  }

  getCartSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  }

  removeCartItem(item: any, event: Event): void {
    event.stopPropagation();
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(c => c !== item);
      }
    });
  }

  getCategories() {
    this.categoryService.getCategoriesWithTree().subscribe((res: any) => {
      this.categories = res.categories;
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      $(window).on('scroll', function () {
        if ($(window).scrollTop() > 50) {
          $('#mainNavbar').addClass('scrolled');
        } else {
          $('#mainNavbar').removeClass('scrolled');
        }
      });
    }
  }
}

