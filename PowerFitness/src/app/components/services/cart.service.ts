import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private products: Product[] = [];
  private cartItemCount: number = 0;

  getCartItemCount(): number {
    return this.cartItemCount;
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.cartItemCount++;
  }

  removeProduct(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.cartItemCount--;
    }
  }

  getProducts(): Product[] {
    return this.products;
  }

  clearCart(): void {
    this.products = [];
    this.cartItemCount = 0;
  }

  getTotal(): number {
    return this.products.reduce((acc, product) => acc + product.price, 0);
  }
}
