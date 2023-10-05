// product-management.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../components/services/product/product.service';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService

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
    imageUrls: [],
    imageUrl: [],
    quantity: 0,
  };
  editingProduct: boolean = false;
  selectedProductId: string = '';
  selectedProduct: Product | undefined;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService // Inyecta ToastrService
  ) {}

  ngOnInit(): void {

    this.toastr.toastrConfig.positionClass = 'custom-toast';
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addProduct(): void {
    if (this.validateProduct(this.newProduct)) {
      if (!this.newProduct.imageUrls) {
        this.newProduct.imageUrls = [];
      }

      this.productService.createProduct(this.newProduct).subscribe(
        () => {
          this.loadProducts();
          this.resetForm();
          this.toastr.success('Producto creado con éxito', 'Éxito');
        },
        (error) => {
          console.error('Error al crear el producto:', error);
          this.toastr.error('Error al crear el producto', 'Error');
        }
      );
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.newProduct = { ...product };
    this.editingProduct = true;
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      if (!Array.isArray(this.selectedProduct.imageUrl)) {
        this.selectedProduct.imageUrl = [this.selectedProduct.imageUrl];
      }

      if (!this.selectedProduct.flavors) {
        this.selectedProduct.flavors = [];
      }

      if (!this.selectedProduct.imageUrls) {
        this.selectedProduct.imageUrls = [];
      }

      console.log('Datos antes de la actualización:', this.selectedProduct);
      this.productService.updateProduct(this.selectedProduct).subscribe(
        () => {
          this.loadProducts();
          this.resetForm();
          this.toastr.success('Producto actualizado con éxito', 'Éxito');
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
          this.toastr.error('Error al actualizar el producto', 'Error');
        }
      );
    }
  }

  deleteProduct(product: Product): void {
    if (product.id) {
      const confirmed = window.confirm(`¿Seguro que deseas eliminar el producto "${product.name}"?`);
      if (confirmed) {
        this.productService.deleteProduct(product.id).subscribe(
          () => {
            this.loadProducts();
            this.toastr.success('Producto eliminado con éxito', 'Éxito');
          },
          (error) => {
            console.error('Error al eliminar el producto:', error);
            this.toastr.error('Error al eliminar el producto', 'Error');
          }
        );
      }
    } else {
      this.toastr.error('El producto no tiene un ID válido', 'Error');
    }
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
      imageUrls: [],
      imageUrl: [],
      quantity: 0,
    };
    this.editingProduct = false;
    this.selectedProductId = '';
    this.selectedProduct = undefined;
  }

  private validateProduct(product: Product): boolean {
    if (!product.name || !product.price || !product.brand || !product.imageUrls) {
      alert('Por favor complete los campos obligatorios: nombre, precio, marca e Imagenes');
      return false;
    }
    return true;
  }
}
