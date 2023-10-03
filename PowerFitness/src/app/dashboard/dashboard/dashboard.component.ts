import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedContent: string = ''; // Variable para controlar el contenido

  // Método para mostrar el contenido según la opción seleccionada
  showContent(content: string): void {
    this.selectedContent = content;
  }
}
