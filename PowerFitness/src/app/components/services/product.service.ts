import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 9.99, description: 'Product 1 description', imageUrl: 'https://example.com/product1.jpg' },
    { id: 2, name: 'Product 2', price: 19.99, description: 'Product 2 description', imageUrl: 'https://example.com/product2.jpg' },
    { id: 3, name: 'Product 3', price: 29.99, description: 'Product 3 description', imageUrl: 'https://example.com/product3.jpg' },
    { id: 4, name: 'Product 4', price: 39.99, description: 'Product 4 description', imageUrl: 'https://example.com/product4.jpg' },
    { id: 5, name: 'Product 5', price: 49.99, description: 'Product 5 description', imageUrl: 'https://example.com/product5.jpg' }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

}
