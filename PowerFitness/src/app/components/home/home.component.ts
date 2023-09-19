import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { BrandService } from '../services/brand/brand.service';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;

  products: Product[] = [];
  brands: Brand[];

  carouselConfig: any = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true
  };

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      // Obtener 6 productos aleatorios
      this.products = this.getRandomProducts(products, 6);
    });

    this.brandService.getBrands().subscribe((brands: Brand[]) => {
      this.brands = brands;
      this.updateCarousel();
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

  updateCarousel() {
    // Actualizar el número de slidesToShow del carrusel
    // según el número de marcas disponibles
    const numBrands = this.brands.length;
    this.carouselConfig.slidesToShow = Math.min(numBrands, 5);

    // Reiniciar el carrusel para reflejar los cambios
    if (this.slickModal) {
      this.slickModal.unslick();
      this.slickModal.initSlick();
    }
  }

  formatPriceWithThousandsSeparator(price: number | null): string {
    return this.decimalPipe.transform(price, '1.2-2') ?? '';
  }
}
