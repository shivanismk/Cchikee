import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/enivironment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (res: any) => {
        // Handle both array response and { products: [] } response
        this.products = Array.isArray(res) ? res : (res?.products ?? res?.data ?? []);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  getImageUrl(path: string): string {
    return `${environment.mediaUrl}/${path}`;
  }

  addProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  deleteProduct(product: any): void {
    Swal.fire({
      title: 'Delete Product?',
      text: `"${product.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Product deleted.',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
          },
          error: (err: any) => {
            Swal.fire('Error', err?.error?.message || 'Could not delete product.', 'error');
          }
        });
      }
    });
  }
}
