// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ImageIndexMixin } from '../../services/product/image-index.mixin';

// Extiende el tipo Product con la interfaz ImageIndexMixin
type ProductWithImageIndex = Product & ImageIndexMixin;

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: ProductWithImageIndex[] = [];
  selectedSize: string = '';
  selectedFlavor: string = '';
  selectedCategory: string = '';
  productCategories: string[] = [];
  productSizes: string[] = [];
  productFlavors: string[] = [];
  filteredProducts: Product[] = [];
  confirmationMessage: string = '';
  currentImageIndex: number = 0;
  

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

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
    this.productService.addProductToCart(selectedProduct);
    this.confirmationMessage = 'Producto agregado al carrito: ' + product.name;

    this.selectedSize = '';
    this.selectedFlavor = '';
  }

  scrollImages(product: ProductWithImageIndex, direction: number): void {
    const imageUrls = product.imageUrl;
    const lastIndex = imageUrls.length - 1;
  
    // Obtén el índice actual de la imagen para este producto
    const currentImageIndex = product.currentImageIndex || 0;
  
    // Calcula el nuevo índice
    let newImageIndex = currentImageIndex + direction;
  
    if (newImageIndex > lastIndex) {
      newImageIndex = 0;
    } else if (newImageIndex < 0) {
      newImageIndex = lastIndex;
    }
  
    // Actualiza el índice de la imagen para este producto
    product.currentImageIndex = newImageIndex;
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

  viewProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
