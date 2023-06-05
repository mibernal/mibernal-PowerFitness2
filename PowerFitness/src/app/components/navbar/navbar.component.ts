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

  cartItemCount: number = 0;  // Variable para almacenar el número de elementos en el carrito

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.addToCart$.subscribe(() => {
      this.cartItemCount++;
    });
  }

  // ...
}