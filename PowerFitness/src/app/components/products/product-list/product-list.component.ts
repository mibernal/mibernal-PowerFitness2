import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedSize: string;
  selectedFlavor: string;
  selectedCategory: string = '';
  productCategories: string[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products.map((product) => ({
        ...product,
        selectedSize: Array.isArray(product.size) ? product.size[0].toString() : '',
        selectedFlavor: Array.isArray(product.flavor) ? product.flavor[0].toString() : '',
      }));

      this.productCategories = Array.from(new Set(this.products.map((product) => product.category)));
      this.filteredProducts = [...this.products];
    });
  }

  addProduct(product: Product): void {
    this.products = [...this.products, product];
  }

  scrollImages(product: Product, direction: number): void {
    const imageUrls = [
      product.imageUrl,
      product.imageUrl2,
      product.imageUrl3,
      product.imageUrl4,
    ];
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

  checkAvailability(product: Product): void {
    const selectedProduct = { ...product };
    if (selectedProduct.id !== undefined) {
      selectedProduct.id = selectedProduct.id.toString();
      this.productService
        .getProductById(selectedProduct.id)
        .subscribe((dbProduct: Product) => {
          // ...
        });
    } else {
      // Manejar el caso en que el ID del producto sea undefined
    }
  }

  filterProductsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(
        (product) => product.category === this.selectedCategory
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }
}
