import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { SearchComponent } from './components/search/search.component';
import { AuthComponent } from './components/auth/auth/auth.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegistrationFormComponent } from './components/auth/registration-form/registration-form.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { DiscountPipe } from './shared/pipes/discount.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import 'firebase/auth';
import { environment } from '../environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    CheckoutComponent,
    ContactComponent,
    HomeComponent,
    NavbarComponent,
    NosotrosComponent,
    SearchComponent,
    AuthComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    FooterComponent,
    HeaderComponent,
    ProductComponent,
    ProductDetailComponent,
    ProductListComponent,
    DiscountPipe,
    
    
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
//    environment,
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    AngularFireStorageModule,

  ],
  exports: [
    // otros componentes exportados aquí
    LoginFormComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
