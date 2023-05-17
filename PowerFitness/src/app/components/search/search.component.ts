import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchQuery: string;

  searchProducts(): void {
    // Aquí puedes agregar la lógica para realizar la búsqueda
    console.log('Realizando búsqueda: ' + this.searchQuery);
  }
}
