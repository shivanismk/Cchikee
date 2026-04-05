import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ContactComponent } from './contact/contact.component';
import { PolicyComponent } from './policy/policy.component';
import { TermsComponent } from './terms/terms.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NewArrivalComponent } from './shared/new-arrival/new-arrival.component';
import { TestimonialsComponent } from './shared/testimonials/testimonials.component';
import { ProductViewComponent } from './shared/product-view/product-view.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AdminModule } from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    HomepageComponent,
    AboutComponent,
    CategoryPageComponent,
    ContactComponent,
    PolicyComponent,
    TermsComponent,
    FaqComponent,
    BlogComponent,
    ProductDetailComponent,
    NewArrivalComponent,
    TestimonialsComponent,
    ProductViewComponent,
    BlogDetailComponent,
    UserLoginComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    AdminModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
