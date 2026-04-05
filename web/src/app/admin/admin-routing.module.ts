import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      { path: 'orders', component: OrderListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }