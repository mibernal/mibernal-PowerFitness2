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
      this.productFlavors = Array.from(new Set(this.products.flatMap((product) => product.flavors)));
      this.filteredProducts = [...this.products];
    });
  }

  addProduct(product: Product): void {
    if ((product.flavors && product.flavors.length > 0 && !product.selectedFlavor) || (product.sizes && product.sizes.length > 0 && !product.selectedSize)) {
      this.confirmationMessage = '';
      return;
    }
    
    const selectedProduct = { ...product };
    this.selectedSize = this.selectedSize;
    this.selectedFlavor = this.selectedFlavor;

    this.cartService.addProduct(selectedProduct);
    this.confirmationMessage = 'Producto agregado al carrito: ' + product.name;

    this.selectedSize = '';
    this.selectedFlavor = '';
  }

  scrollImages(product: Product, direction: number): void {
    const imageUrls = product.imageUrl;
    const lastIndex = imageUrls.length - 1;
  
    this.currentImageIndex += direction;
  
    if (this.currentImageIndex > lastIndex) {
      this.currentImageIndex = 0;
    } else if (this.currentImageIndex < 0) {
      this.currentImageIndex = lastIndex;
    }
  
    product.imageUrl[this.currentImageIndex];
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

  filterProductsByCategory(category?: string): void {
    if (category) {
      this.selectedCategory = category;
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
    } else {
      this.selectedCategory = '';
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
        (product) => product.flavors.includes(this.selectedFlavor)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }
}
