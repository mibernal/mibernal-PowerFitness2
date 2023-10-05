import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Product } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  products: Product[] = [];

  constructor(private cartService: CartService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.products = this.cartService.getProducts();
  }

  getTotal(): number {
    return this.products.reduce((acc, product) => acc + product.price, 0);
  }

  removeProduct(product: Product): void {
    this.cartService.removeProduct(product);
    this.products = this.cartService.getProducts();
  }

  getSelectedSize(product: Product): string {
    return product.selectedSize ? product.selectedSize : 'N/A';
  }
  
  getSelectedFlavor(product: Product): string {
    return product.selectedFlavor ? product.selectedFlavor : 'N/A';
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  completePurchase(): void {

    const isSuccess = true; // Indica si la compra se ha completado con éxito
  
    if (isSuccess) {
      // Redirigir a la página de checkout
      this.router.navigate(['/checkout']);
    } else {
      // Mostrar mensaje de error
      this.snackBar.open('Ha ocurrido un error al completar la compra. Por favor, inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
    }
  }  
}