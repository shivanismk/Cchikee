import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';

// Services
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { AdminRoutingModule } from './admin-routing.module';

// Guards
// import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    OrderListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AdminDashboardComponent,
    ProductListComponent,
    ProductFormComponent,
  ],
  providers: [
    ProductService,
    OrderService,
    // AuthGuard
  ]
})
export class AdminModule { }