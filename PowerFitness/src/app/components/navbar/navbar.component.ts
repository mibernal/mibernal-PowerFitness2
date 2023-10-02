import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery: string;

  cartItemCount: number = 0;
  productCategories: string[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.addToCart$.subscribe(() => {
      this.cartItemCount++;
    });
  }

  // Define la función filterByCategory en el componente NavbarComponent
  filterByCategory(category: string): void {
    // Llama al método en product-list.component.ts para aplicar el filtro
    this.productService.filterProductsByCategory(category);
  }
}
