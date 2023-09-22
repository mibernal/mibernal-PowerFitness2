import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardChildComponent } from './dashboard-child/dashboard-child.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardChildComponent,
    ProductAddComponent,
    ProductEditComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class DashboardModule { }
