import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Product } from 'src/app/models/product.model';
import { LocationService } from '../services/location/location.service';
import { OrderService } from '../services/order/order.service'; // Importa el servicio OrderService
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
  simularPago: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private cartService: CartService,
    private router: Router,
    private locationService: LocationService,
    private orderService: OrderService // Inyecta el servicio OrderService
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
      fecha: [new Date().toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })], // Inyecta la fecha y hora actual
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
    // Verificar si el formulario es inválido
    if (this.checkoutForm.invalid) {
      // Marcar campos inválidos como "touched" para mostrar los mensajes de error
      this.markFormControlsAsTouched(this.checkoutForm);
  
      // Mostrar mensajes de error detallados para cada control
      for (const controlName in this.checkoutForm.controls) {
        const control = this.checkoutForm.get(controlName);
  
        if (!control) {
          continue;
        }
  
        if (control instanceof FormGroup) {
          continue; // Ignorar FormGroup anidados
        }
  
        if (control.errors) {
          for (const errorName in control.errors) {
            switch (errorName) {
              case 'required':
                console.log(`${controlName} es requerido.`);
                break;
              case 'email':
                console.log(`${controlName} debe ser una dirección de correo electrónico válida.`);
                break;
              // Agrega casos adicionales para otros tipos de validadores personalizados si los tienes
            }
          }
        }
      }
  
      return;
    }
    // Aquí, puedes continuar con el proceso de envío del formulario
    // ...

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

    this.orderService.createOrder(pedido) // Llama al método createOrder del servicio OrderService
      .then((orderId: any) => {
        console.log('Pedido guardado exitosamente. ID del pedido:', orderId);
        if (this.simularPago) {
          this.simularPagoExitoso();
        } else {
          console.log('No se realizó un pago real.');
          // Aquí puedes redirigir al usuario a la página de éxito del pedido
        }
      })
      .catch((error: any) => {
        console.error('Error al guardar el pedido:', error);
      });
  }

  simularPagoExitoso(): void {
    // Simulación de pago exitoso
    console.log('Pago simulado exitosamente.');
    // Aquí puedes redirigir al usuario a la página de éxito del pedido después de la simulación de pago
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

  markFormControlsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormControlsAsTouched(control);
      } else if (control !== null) { // Verifica que control no sea nulo
        (control as any).markAsTouched();
      }
    });
  }
}
