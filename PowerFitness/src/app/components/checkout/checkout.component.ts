import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from 'src/app/models/product.model';
import { LocationService } from '../services/location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  products: Product[];
  total: number;
  departments: any[];
  cities: any[];

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private cartService: CartService,
    private router: Router,
    private locationService: LocationService // Inject the LocationService
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      numero_documento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion_envio: ['', Validators.required],
      complemento: [''],
      celular: ['', Validators.required],
      notas: [''],
      fecha: ['', Validators.required],
      numero_pedido: [''],
      estado: ['']
    });

    this.products = this.cartService.getProducts();
    this.total = this.cartService.getTotal();

    // Fetch departments from the LocationService
    this.locationService.departments$.subscribe((departments) => {
      this.departments = departments;
    });

    // Initialize the cities array with an empty array
    this.cities = [];

    // Subscribe to changes in the selected department
    this.checkoutForm.get('departamento')?.valueChanges.subscribe((departmentId) => {
      if (departmentId) {
        // Fetch cities by department from the LocationService
        this.locationService.getCitiesByDepartment(departmentId).subscribe((cities) => {
          this.cities = cities;
        });
      } else {
        // If no department selected, reset the cities array
        this.cities = [];
      }
    });
  }

  onDepartmentChange(departmentId: string): void {
    if (departmentId) {
      // Fetch cities by department from the LocationService
      this.locationService.getCitiesByDepartment(departmentId).subscribe((cities: any[]) => {
        this.cities = cities;
      });
    } else {
      this.cities = [];
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    const pedido = {
      numero_documento: this.checkoutForm.value.numero_documento,
      email: this.checkoutForm.value.email,
      nombres: this.checkoutForm.value.nombres,
      apellidos: this.checkoutForm.value.apellidos,
      departamento: this.checkoutForm.value.departamento,
      ciudad: this.checkoutForm.value.ciudad,
      direccion_envio: this.checkoutForm.value.direccion_envio,
      complemento: this.checkoutForm.value.complemento,
      celular: this.checkoutForm.value.celular,
      notas: this.checkoutForm.value.notas,
      fecha: this.checkoutForm.value.fecha,
      numero_pedido: '', // Se generará automáticamente en Firestore
      estado: '' // Se establecerá automáticamente en Firestore
    };

    this.firestore
      .collection('pedidos')
      .add(pedido)
      .then((docRef: { id: any; }) => {
        const numeroPedido = docRef.id;
        this.firestore
          .collection('pedidos')
          .doc(numeroPedido)
          .update({
            numero_pedido: numeroPedido,
            estado: 'pendiente'
          })
          .then(() => {
            console.log('Pedido guardado exitosamente.');
            // Aquí puedes redirigir al usuario a la página de éxito del pedido
          })
          .catch((error: any) => {
            console.error('Error al actualizar el número de pedido y estado:', error);
          });
      })
      .catch((error: any) => {
        console.error('Error al guardar el pedido:', error);
      });
  }

  getSelectedFlavor(product: Product): string {
    return product.selectedFlavor ? product.selectedFlavor : 'N/A';
  }
  
  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  removeProduct(product: Product): void {
    this.cartService.removeProduct(product);
    this.products = this.cartService.getProducts();
    this.total = this.cartService.getTotal();
  }

  getTotal(): number {
    return this.total;
  }
}