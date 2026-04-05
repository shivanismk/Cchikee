import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ContactComponent } from './contact/contact.component';
import { PolicyComponent } from './policy/policy.component';
import { TermsComponent } from './terms/terms.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {path: '', component: HomepageComponent },
  {path: "home", component:HomepageComponent},
  {path: "about", component:AboutComponent},
  {path: "category", component:CategoryPageComponent},
  {path: 'product/:id', component:ProductDetailComponent},
  {path: "contact", component:ContactComponent},
  {path: 'policy', component:PolicyComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'faq', component:FaqComponent},
  {path: 'blog', component:BlogComponent},
  {path: 'blog-detail', component: BlogDetailComponent},
  {path: 'user-login', component: UserLoginComponent},
  {path: 'cart', component: CartComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'dashboard', component: DashboardComponent},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
