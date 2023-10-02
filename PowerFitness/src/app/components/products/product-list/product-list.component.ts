import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ImageIndexMixin } from '../../services/product/image-index.mixin';

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

      this.productCategories = this.productService.getProductCategories(this.products);
      this.productSizes = this.productService.getProductSizes(this.products);
      this.productFlavors = this.productService.getProductFlavors(this.products);
      this.filteredProducts = [...this.products];
    });
  }

  addProduct(product: Product): void {
    if (
      (product.flavors && product.flavors.length > 0 && !product.selectedFlavor) ||
      (product.sizes && product.sizes.length > 0 && !product.selectedSize)
    ) {
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
    this.productService.scrollImages(product, direction);
  }

  checkAvailability(product: Product): void {
    this.productService.checkAvailability(product);
  }

  filterProductsByCategory(category?: string): void {
    this.productService.filterProductsByCategory(category);
  }

  filterProductsBySize(): void {
    this.productService.filterProductsBySize(this.selectedSize);
  }

  filterProductsByFlavor(): void {
    this.productService.filterProductsByFlavor(this.selectedFlavor);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
