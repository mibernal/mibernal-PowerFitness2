// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedSize: string = '';
  selectedFlavor: string = '';
  selectedCategory: string = '';
  productCategories: string[] = [];
  productSizes: string[] = [];
  productFlavors: string[] = [];
  filteredProducts: Product[] = [];
  confirmationMessage: string = '';
  currentImageIndex: number = 0;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products.map((product) => ({
        ...product,
        selectedSize: '',
        selectedFlavor: '',
      }));

      this.productCategories = Array.from(new Set(this.products.map((product) => product.category)));
      this.productSizes = Array.from(new Set(this.products.map((product) => product.size)));
      this.productFlavors = Array.from(new Set(this.products.map((product) => product.flavor)));
      this.filteredProducts = [...this.products];
    });
  }

  addProduct(product: Product): void {
    this.cartService.addProduct(product);
    this.confirmationMessage = 'Producto agregado al carrito: ' + product.name;
  }

  scrollImages(product: Product, direction: number): void {
    const imageUrls = [
      product.imageUrl,
      product.imageUrl2,
      product.imageUrl3,
      product.imageUrl4,
    ];
    const lastIndex = imageUrls.length - 1;

    this.currentImageIndex += direction;

    if (this.currentImageIndex > lastIndex) {
      this.currentImageIndex = 0;
    } else if (this.currentImageIndex < 0) {
      this.currentImageIndex = lastIndex;
    }

    product.imageUrl = imageUrls[this.currentImageIndex];
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

  filterProductsBySize(): void {
    if (this.selectedSize) {
      this.filteredProducts = this.products.filter(
        (product) => product.size === this.selectedSize
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  filterProductsByFlavor(): void {
    if (this.selectedFlavor) {
      this.filteredProducts = this.products.filter(
        (product) => product.flavor === this.selectedFlavor
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }
}
