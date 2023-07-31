import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { BrandService } from '../services/brand/brand.service';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  carouselConfig: any = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000
  };

  constructor(
    private productService: ProductService,
    private brandService: BrandService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      // Obtener 6 productos aleatorios
      this.products = this.getRandomProducts(products, 6);
    });

    this.brandService.getBrands().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });
  }

  // Función para obtener productos aleatorios
  private getRandomProducts(products: Product[], count: number): Product[] {
    const randomProducts: Product[] = [];
    const totalProducts = products.length;

    if (totalProducts <= count) {
      return products;
    }

    const selectedIndices: number[] = [];

    while (randomProducts.length < count) {
      const randomIndex = Math.floor(Math.random() * totalProducts);

      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
        randomProducts.push(products[randomIndex]);
      }
    }

    return randomProducts;
  }
}
