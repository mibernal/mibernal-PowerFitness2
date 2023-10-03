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
  selectedProduct: Product | undefined;

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
    if (this.validateProduct(this.newProduct)) {
      this.productService.createProduct(this.newProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product }; // Copia profunda del producto para no modificar el original
    this.newProduct = { ...product }; // También actualiza newProduct para mostrar los datos en el formulario
    this.editingProduct = true;
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      // Asegurarse de que las propiedades imageUrl sean un arreglo
      if (!Array.isArray(this.selectedProduct.imageUrl)) {
        this.selectedProduct.imageUrl = [this.selectedProduct.imageUrl];
      }
  
      // Agregar lógica para manejar campos no fundamentales vacíos
      if (!this.selectedProduct.flavors) {
        this.selectedProduct.flavors = []; // Inicializa como un arreglo vacío si está vacío
      }
  
      // Agregar lógica para manejar el campo imageUrl vacío
      if (!this.selectedProduct.imageUrl || this.selectedProduct.imageUrl.length === 0) {
        this.selectedProduct.imageUrl = ['']; // Inicializa como un arreglo con una cadena vacía si está vacío
      }
      
      // Puedes hacer lo mismo para otros campos no fundamentales
  
      console.log('Datos antes de la actualización:', this.selectedProduct);
      this.productService.updateProduct(this.selectedProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  deleteProduct(product: Product): void {
    if (product.id) {
      const confirmed = window.confirm(`¿Seguro que deseas eliminar el producto "${product.name}"?`);
      if (confirmed) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.loadProducts();
        });
      }
    } else {
      // Manejo de error, el producto no tiene un ID válido
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
      imageUrls: undefined,
      imageUrl: [],
      quantity: 0
    };
    this.editingProduct = false;
    this.selectedProductId = '';
    this.selectedProduct = undefined;
  }

  private validateProduct(product: Product): boolean {
    // Aquí puedes agregar lógica de validación, por ejemplo, verificar que los campos obligatorios no estén vacíos
    if (!product.name || !product.price || !product.brand) {
      alert('Por favor complete los campos obligatorios: nombre, precio y marca');
      return false;
    }
    return true;
  }
}
