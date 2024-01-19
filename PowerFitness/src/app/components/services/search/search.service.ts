// search.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../../models/product.model';
import { SearchResults } from '../../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private firestore: AngularFirestore) {}

  search(query: string): Observable<SearchResults> {

    console.log('Consulta de búsqueda:', query);
    // Convertir la consulta a minúsculas para hacerla insensible a mayúsculas y minúsculas
    const lowerCaseQuery = query.toLowerCase();

    const products$ = this.firestore.collection<Product>('products', ref => ref
      .where('name', '>=', lowerCaseQuery)
      .where('name', '<=', lowerCaseQuery + '\uf8ff'))
      .valueChanges();

    const categories$ = this.firestore.collection('categories', ref => ref
      .where('name', '>=', lowerCaseQuery)
      .where('name', '<=', lowerCaseQuery + '\uf8ff'))
      .valueChanges();

    // CombineLatest emite un arreglo con los resultados de ambos observables
    return combineLatest([products$, categories$]).pipe(
      // Map para transformar el arreglo en un objeto SearchResults
      map(([products, categories]) => ({ products, categories } as SearchResults))
    );
  }
}
