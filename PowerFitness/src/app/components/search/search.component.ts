// search.component.ts
import { Component } from '@angular/core';
import { SearchService } from '../services/search/search.service';
import { SearchResults } from '../../models/search.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
openElement(_t17: Product) {
throw new Error('Method not implemented.');
}
  searchQuery: string;
  searchResults: SearchResults = { products: [], categories: [] };

  constructor(private searchService: SearchService) {}

  searchProducts(): void {
    console.log('Search Query:', this.searchQuery);
    if (this.searchQuery) {
      this.searchService.search(this.searchQuery).subscribe(
        (results: SearchResults) => {
          console.log('Resultados de búsqueda del servicio:', results);
        },
        (error) => {
          console.error('Error al realizar la búsqueda:', error);
        }
      );
    } else {
      console.log('Ingresa un término de búsqueda válido');
    }
  }
}
