// src/app/dashboard/dashboard-child/dashboard-child.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-child',
  templateUrl: './dashboard-child.component.html',
  styleUrls: ['./dashboard-child.component.scss'],
})
export class DashboardChildComponent {
  constructor(private router: Router) {}

  navigateBack() {
    this.router.navigate(['dashboard']);
  }
}
