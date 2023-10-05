import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Product } from 'src/app/models/product.model';
import { LocationService } from '../services/location/location.service';
import { OrderService } from '../services/order/order.service';
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
    private orderService: OrderService
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
      fecha: [new Date().toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })],
      numero_pedido: [''],
      estado: [''],
      productos: this.formBuilder.array([]) 
    });

    this.products = this.cartService.getProducts();
    this.total = this.cartService.getTotal();

    this.locationService.departments$.subscribe((departments) => {
      this.departments = departments;
    });

    this.cities = [];

    this.checkoutForm.get('departamento')?.valueChanges.subscribe((departmentId) => {
      if (departmentId) {
        this.locationService.getCitiesByDepartment(departmentId).subscribe((cities) => {
          this.cities = cities;
        });
      } else {
        this.cities = [];
      }
    });
  }

  onDepartmentChange(departmentId: string): void {
    if (departmentId) {
      this.locationService.getCitiesByDepartment(departmentId).subscribe((cities: any[]) => {
        this.cities = cities;
      });
    } else {
      this.cities = [];
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.markFormControlsAsTouched(this.checkoutForm);
      for (const controlName in this.checkoutForm.controls) {
        const control = this.checkoutForm.get(controlName);
        if (!control) {
          continue;
        }
        if (control instanceof FormGroup) {
          continue;
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
            }
          }
        }
      }
      return;
    }
  
    // Agregar los detalles de los productos al FormArray 'productos'
    const productosFormArray = this.checkoutForm.get('productos') as FormArray;
    this.products.forEach((product) => {
      const productFormGroup = this.formBuilder.group({

        // Excluyendo los campos que no deben incluirse en el pedido
        brand: [product.brand],
        category: [product.category],
        description: [product.description],
        discount: [product.discount],
        id: [product.id],
        nombre: [product.name],
        precio: [product.price],
        cantidad: [product.quantity],
        size: [product.selectedSize || ''], 
        sizes: [product.selectedSize || ''], 
        flavor: [product.selectedFlavor || ''],
      });
      productosFormArray.push(productFormGroup);
    });
  
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
      estado: '', // Se establecerá automáticamente en Firestore
      productos: this.checkoutForm.value.productos // Ahora se agregarán los detalles de los productos
    };
  
    this.orderService.createOrder(pedido)
      .then((orderId: any) => {
        console.log('Pedido guardado exitosamente. ID del pedido:', orderId);
        if (this.simularPago) {
          this.simularPagoExitoso();
        } else {
          console.log('No se realizó un pago real.');
          this.router.navigate(['/exito-pedido']);
        }
      })
      .catch((error: any) => {
        console.error('Error al guardar el pedido:', error);
      });
  }

  simularPagoExitoso(): void {
    console.log('Pago simulado exitosamente.');
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
      } else if (control !== null) {
        (control as any).markAsTouched();
      }
    });
  }
}
