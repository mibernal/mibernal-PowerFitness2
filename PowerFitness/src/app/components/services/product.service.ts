import { initializeApp } from 'firebase/app';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  providedIn: 'root'
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
    const products: Product[] = [];
    const productsQuery = query(this.collectionRef, orderBy('name'));
    return new Observable((observer) => {
      getDocs(productsQuery).then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc) => {
          const product = doc.data() as Product;
          product.id = doc.id;
          products.push(product);
        });
        observer.next(products);
      });
    });
  }

  getProductById(id: string): Observable<Product> {
    const productDocRef = doc(this.collectionRef, id);
    return new Observable((observer) => {
      getDoc(productDocRef).then((productDoc: DocumentData) => {
        if (productDoc['exists']) {
          const product = productDoc['data']() as Product;
          product.id = productDoc['id'];
          observer.next(product);
        } else {
          observer.error(`Product with id ${id} not found`);
        }
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  createProduct(product: Product): Observable<Product> {
    return new Observable((observer) => {
      setDoc(doc(this.collectionRef, product.id), product).then(() => {
        const newProduct = { ...product };
        observer.next(newProduct);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  

  updateProduct(product: Product): Observable<void> {
    const productDocRef = doc(this.collectionRef, product.id);
    return new Observable((observer) => {
      updateDoc(productDocRef, product as any).then(() => {
        observer.next();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  deleteProduct(id: string): Observable<void> {
    const productDocRef = doc(this.collectionRef, id);
    return new Observable((observer) => {
      deleteDoc(productDocRef).then(() => {
        observer.next();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
