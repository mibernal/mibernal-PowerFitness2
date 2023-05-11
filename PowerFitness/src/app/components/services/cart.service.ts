import { Injectable } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: Product[];

  constructor() {
    this.cartItems = [];
  }

  addProduct(product: Product): void {
    this.cartItems.push(product);
  }

  removeProduct(product: Product): void {
    const index = this.cartItems.indexOf(product);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  getProducts(): Product[] {
    return this.cartItems;
  }
}
