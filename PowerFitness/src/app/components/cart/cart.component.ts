import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  products: Product[];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products = [];
   }

  ngOnInit(): void {
    this.cartService.cartItems().subscribe(items => {
      this.products = items.map(item => this.productService.getProduct(item.id));
    });
  }

  getTotal(): number {
    return this.products.reduce((acc, product) => acc + product.price, 0);
  }

  removeProduct(product: Product): void {
    this.cartService.removeProduct(product);
    this.products = this.cartService.getProducts();
  }
}
