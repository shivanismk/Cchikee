import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  submitted = false;

  // 3-level cascading categories
  levelOneCategories: any[] = [];
  levelTwoCategories: any[] = [];
  levelThreeCategories: any[] = [];
  selectedLevelOne: any = null;
  selectedLevelTwo: any = null;

  // File upload
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  fileError = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      level_one_category: ['', Validators.required],
      level_two_category: [''],
      category_id: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(0), Validators.max(10000)]],
      is_active: [true],
      is_new_arrival: [false],
      is_trending: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesWithTree().subscribe({
      next: (res: any) => { this.levelOneCategories = res.categories; },
      error: () => { this.levelOneCategories = []; }
    });
  }

  // ── File handling ──────────────────────────────────────────

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.fileError = '';
    const newFiles = Array.from(input.files);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    for (const file of newFiles) {
      if (!allowed.includes(file.type)) {
        this.fileError = `"${file.name}" is not a valid image (jpg, png, webp, gif only).`;
        input.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = `"${file.name}" exceeds 5 MB limit.`;
        input.value = '';
        return;
      }
    }

    // Append to existing selection
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    });

    input.value = ''; // reset so same file can be re-added if removed
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  // ── Category cascading ─────────────────────────────────────

  onLevelOneChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.selectedLevelOne = this.levelOneCategories.find(c => c.id === id) || null;
    this.levelTwoCategories = this.selectedLevelOne?.subcategories || [];
    this.levelThreeCategories = [];
    this.selectedLevelTwo = null;
    this.productForm.patchValue({ level_one_category: id, level_two_category: '', category_id: '' });
    if (!this.levelTwoCategories.length) {
      this.productForm.patchValue({ category_id: id });
    }
  }

  onLevelTwoChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.selectedLevelTwo = this.levelTwoCategories.find(c => c.id === id) || null;
    this.levelThreeCategories = this.selectedLevelTwo?.subcategories || [];
    this.productForm.patchValue({ level_two_category: id, category_id: '' });
    if (!this.levelThreeCategories.length) {
      this.productForm.patchValue({ category_id: id });
    }
  }

  onLevelThreeChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.productForm.patchValue({ category_id: id });
  }

  // ── Submit ─────────────────────────────────────────────────

  onSubmit(): void {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    if (!this.selectedFiles.length) {
      this.fileError = 'Please select at least one product image.';
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.value;

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        payload.append(key, formData[key]);
      }
    });
    this.selectedFiles.forEach(file => payload.append('images', file, file.name));

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Product added successfully!',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
        this.router.navigate(['/admin/products']);
      },
      error: (err: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: err?.error?.message || 'Could not add product. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // Getters
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get category_id() { return this.productForm.get('category_id'); }
  get stock() { return this.productForm.get('stock'); }
}
