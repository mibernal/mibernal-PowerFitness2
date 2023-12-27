import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from '../services/cart/cart.service';
import { ProductService } from '../services/product/product.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$: Observable<string> = this.selectedCategorySubject.asObservable();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProductCategories().subscribe((categories) => {
      this.productCategories = categories;
    });

    this.productService.addToCart$.subscribe(() => {
      this.cartItemCount++;
    });

    this.productService.selectedCategory$.subscribe((category) => {
      this.filterByCategory(category);
    });
  }

  searchProducts(): void {
    // Lógica para realizar la búsqueda
    console.log('Realizando búsqueda: ' + this.searchQuery);
    // Puedes agregar más lógica según tus necesidades
  }

  filterByCategory(category: string): void {
    console.log('Filtrando por categoría: ' + category);
    if (this.selectedCategorySubject.value !== category) {
      this.selectedCategorySubject.next(category);
      this.productService.filterProductsByCategory(category);
      
      // Redirige al componente product-list con el parámetro de consulta category
      this.router.navigate(['/product-list'], { queryParams: { category: category } });
    }
  }
}