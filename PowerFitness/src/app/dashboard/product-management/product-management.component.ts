import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../components/services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    currentImageIndex: 0,
    brand: '',
    category: '',
    discount: 0,
    flavors: [],
    size: '',
    sizes: [],
    stock: 0,
    selectedSize: '',
    selectedFlavor: '',
    imageUrls: undefined,
    imageUrl: [],
    quantity: 0
  };
  editingProduct: boolean = false;
  selectedProductId: string = '';
productToEdit: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.resetForm();
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = true;
    this.selectedProductId = product.id || '';
    this.productService.getProductById(this.selectedProductId).subscribe((data) => {
      if (data) {
        this.newProduct = data;
      } else {
        // Manejo de error, producto no encontrado
      }
    });
  }

  updateProduct(): void {
    this.productService.updateProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.resetForm();
    });
  }

  deleteProduct(product: Product): void {
    this.productService.deleteProduct(product.id || '').subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      currentImageIndex: 0,
      brand: '',
      category: '',
      discount: 0,
      flavors: [],
      size: '',
      sizes: [],
      stock: 0,
      selectedSize: '',
      selectedFlavor: '',
      imageUrls: undefined,
      imageUrl: [],
      quantity: 0
    };
    this.editingProduct = false;
    this.selectedProductId = '';
  }
}
