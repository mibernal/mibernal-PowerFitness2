import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ShipmentManagementComponent } from './shipment-management/shipment-management.component';
import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';

@NgModule({
  declarations: [
    DashboardComponent,
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
      { path: 'dashboard', component: DashboardComponent }, 
      { path: 'invoice-management', component: InvoiceManagementComponent },
      { path: 'order-management', component: OrderManagementComponent },
      {
        path: 'product-management', component: ProductManagementComponent,
      },
      { path: 'shipment-management', component: ShipmentManagementComponent },
    ]), 
  ],
})
export class DashboardModule {}
