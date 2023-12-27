import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';
import { ImageIndexMixin } from '../../services/product/image-index.mixin';
import { ActivatedRoute } from '@angular/router';

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

// Dentro de la clase ProductListComponent
selectedSortOrder: string = 'popularity'; // Opción predeterminada
sortOptions = [
  { value: 'popularity', label: 'Popularidad' },
  { value: 'averageRating', label: 'Puntuación media' },
  { value: 'latestAdded', label: 'Últimos agregados' },
  { value: 'lowToHigh', label: 'Precio bajo a alto' },
  { value: 'highToLow', label: 'Precio alto a bajo' },
  { value: 'atoz', label: 'De la A a la Z' },
];

sortProducts(): void {
  // Lógica para ordenar los productos según la opción seleccionada
  switch (this.selectedSortOrder) {
    case 'popularity':
      this.filteredProducts.sort((a, b) => {
        const popularityA = a.popularity !== undefined ? a.popularity : 0;
        const popularityB = b.popularity !== undefined ? b.popularity : 0;
        return popularityA - popularityB;
      });
      break;
    case 'averageRating':
      this.filteredProducts.sort((a, b) => {
        const ratingA = a.averageRating !== undefined ? a.averageRating : 0;
        const ratingB = b.averageRating !== undefined ? b.averageRating : 0;
        return ratingA - ratingB;
      });
      break;
    case 'latestAdded':
      this.filteredProducts.sort((a, b) => {
        const dateAddedA = a.dateAdded !== undefined ? a.dateAdded.getTime() : 0;
        const dateAddedB = b.dateAdded !== undefined ? b.dateAdded.getTime() : 0;
        return dateAddedA - dateAddedB;
      });
      break;
    case 'lowToHigh':
      this.filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'highToLow':
      this.filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'atoz':
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
}

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products.map((product) => ({
        ...product,
        selectedSize: '',
        selectedFlavor: '',
        popularity: product.popularity || 0, // Use 0 as the default value if popularity is undefined
        averageRating: product.averageRating || 0, // Use 0 as the default value if averageRating is undefined
        dateAdded: product.dateAdded || new Date(), // Use a default date if dateAdded is undefined
      }));
  
      this.productService.getProductCategories().subscribe((categories) => {
        this.productCategories = categories;
      });
  
      this.productSizes = this.productService.getProductSizes(this.products);
      this.productFlavors = this.productService.getProductFlavors(this.products);
  
      // Obtén el parámetro de consulta category y filtra los productos solo si está presente
      const category = this.route.snapshot.queryParamMap.get('category');
      this.selectedCategory = category || '';
  
      if (category !== null) {
        this.filterProductsByCategory(category);
      } else {
        // Si no hay un parámetro de categoría, muestra todos los productos
        this.filteredProducts = [...this.products];
      }
    });
  
    this.productService.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category;  // Actualiza la categoría seleccionada
      this.filterProductsByCategory(category);
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
    this.selectedCategory = category || this.selectedCategory;

    // Filtra los productos localmente
    this.filteredProducts = this.products.filter((product) =>
      !this.selectedCategory || product.category === this.selectedCategory
    );
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

  resetFilters(): void {
    this.selectedSize = '';
    this.selectedFlavor = '';
    this.selectedCategory = '';
    this.filteredProducts = [...this.products];
  }
}
  


