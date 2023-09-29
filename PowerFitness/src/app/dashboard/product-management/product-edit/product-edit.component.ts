import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../components/services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  productId: string;
  product: Product = {
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
    imageUrl: []
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = idParam;
      this.productService.getProductById(this.productId).subscribe((data) => {
        if (data) {
          this.product = data;
        } else {
          // Manejo de error, producto no encontrado
        }
      });
    } else {
      // Manejo de error, el parámetro 'id' no está presente
    }
  }

  updateProduct(): void {
    this.productService.updateProduct(this.product).subscribe(() => {
      this.router.navigate(['/product-list']);
    });
  }
}
