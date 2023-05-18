import { initializeApp } from 'firebase/app';
import { Injectable } from '@angular/core';
import { map, Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: any;
  private collectionRef: CollectionReference<DocumentData>;

  constructor() {
    const app = initializeApp(environment.firebase);
    const firestore = getFirestore(app);
    this.collectionRef = collection(firestore, 'productos');
  }

  getProducts(): Observable<Product[]> {
    const productsQuery = query(this.collectionRef, orderBy('name'));
    return from(getDocs(productsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Product,
        }))
      )
    );
  }
  

  getProductById(id: string): Observable<Product> {
    const productDocRef = doc(this.collectionRef, id);
    return new Observable((observer) => {
      getDoc(productDocRef)
        .then((productDoc: DocumentData) => {
          if (productDoc['exists']()) {
            const product = productDoc['data']() as Product;
            product.id = productDoc['id'];
            observer.next(product);
          } else {
            observer.error('Product not found');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  createProduct(product: Product): Observable<Product> {
    const id = this.firestore.createId();
    product.id = id;
    return new Observable((observer) => {
      setDoc(doc(this.collectionRef, product.id), product)
        .then(() => {
          const newProduct = { ...product };
          observer.next(newProduct);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateProduct(product: Product): Observable<void> {
    const productDocRef = doc(this.collectionRef, product.id);
    return new Observable((observer) => {
      updateDoc(productDocRef, product as any)
        .then(() => {
          observer.next();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  deleteProduct(id: string): Observable<void> {
    const productDocRef = doc(this.collectionRef, id);
    return new Observable((observer) => {
      deleteDoc(productDocRef)
        .then(() => {
          observer.next();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
