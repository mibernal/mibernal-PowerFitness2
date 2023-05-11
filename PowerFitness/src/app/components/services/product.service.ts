import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection: AngularFirestoreCollection<Product>;
  private products: Observable<Product[]>;

  constructor(private firestore: AngularFirestore) {
    this.productsCollection = firestore.collection<Product>('productos');
    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }

  getProduct(id: string): Observable<Product> {
    return this.productsCollection.doc<Product>(id).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Product;
        const productId = a.payload.id;
        return { id: productId, ...data };
      })
    );
  }
}
