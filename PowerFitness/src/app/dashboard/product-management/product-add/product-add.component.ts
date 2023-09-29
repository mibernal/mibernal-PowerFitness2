import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../app/components/services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
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
    imageUrl: []
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {}

  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.router.navigate(['/product-list']);
    });
  }
}
