import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardChildComponent } from './dashboard-child/dashboard-child.component';
import { ProductAddComponent } from './product-management/product-add/product-add.component';
import { ProductEditComponent } from './product-management/product-edit/product-edit.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ShipmentManagementComponent } from './shipment-management/shipment-management.component';
import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardChildComponent,
    ProductAddComponent,
    ProductEditComponent,
    SidebarComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    ShipmentManagementComponent,
    InvoiceManagementComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'dashboard', component: DashboardComponent }, // Ruta del dashboard
      { path: 'invoice-management', component: InvoiceManagementComponent },
      { path: 'order-management', component: OrderManagementComponent },
      {
        path: 'product-management',
        component: ProductManagementComponent,
        children: [
          { path: 'add', component: ProductAddComponent },
          { path: 'edit/:id', component: ProductEditComponent },
          // Otras rutas hijas si es necesario
        ],
      },
      { path: 'shipment-management', component: ShipmentManagementComponent },
    ]), // Agrega una coma aquí
  ],
})
export class DashboardModule {}
