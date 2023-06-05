import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
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
  product: Product | undefined;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.params['id'];
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.product = products.find(product => product.id === productId);
        if (!this.product) {
          console.error('Product not found');
        }
      },
      (error: any) => {
        console.error('Error retrieving products:', error);
      }
    );
  }  

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(
        (product: Product) => {
          if (product) {
            this.product = product;
          } else {
            console.error('Product not found');
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
  
  setCurrentImageIndex(index: number): void {
    this.currentImageIndex = index;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
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
}