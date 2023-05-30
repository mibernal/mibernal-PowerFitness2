import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegistrationFormComponent } from './components/auth/registration-form/registration-form.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductImportComponent } from './components/product-import/product-import.component';
import { UserPanelComponent } from "./components/user-panel/user-panel.component";
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'home', component: HomeComponent },
{ path: 'product-list', component: ProductListComponent },
{ path: 'products/:id', component: ProductDetailComponent },
{ path: 'cart', component: CartComponent },
{ path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] }, // Proteger ruta con AuthGuard
{ path: 'contact', component: ContactComponent },
{ path: 'nosotros', component: NosotrosComponent },

{ path: 'login-form', component: LoginFormComponent },
{ path: 'register', component: RegistrationFormComponent },
{ path: 'product-import', component: ProductImportComponent, canActivate: [AuthGuard] }, // Proteger ruta con AuthGuard
{ path: 'product-management', component: ProductManagementComponent, canActivate: [AuthGuard] }, // Proteger ruta con AuthGuard
{ path: 'user-panel', component: UserPanelComponent, canActivate: [AuthGuard] }, // Proteger ruta con AuthGuard

{ path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }