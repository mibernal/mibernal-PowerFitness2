import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  scrollImages(product: Product, direction: number): void {
    const imageUrls = [product.imageUrl, product.imageUrl2, product.imageUrl3, product.imageUrl4];
    const currentIndex = imageUrls.indexOf(product.imageUrl);
    const lastIndex = imageUrls.length - 1;
    let newIndex: number;

    if (direction === 1) {
      newIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;
    }

    product.imageUrl = imageUrls[newIndex];
  }
}
