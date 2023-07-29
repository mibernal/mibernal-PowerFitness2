import { Injectable } from '@angular/core';
import { map, Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Brand } from '../../../models/brand.model';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  orderBy,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private firestore: any;
  private collectionRef: CollectionReference<DocumentData>;

  constructor() {
    const app = initializeApp(environment.firebase);
    const firestore = getFirestore(app);
    this.collectionRef = collection(firestore, 'brands');
  }

  getBrands(): Observable<Brand[]> {
    const brandsQuery = query(this.collectionRef, orderBy('brand'));
    return from(getDocs(brandsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Brand }))
      )
    );
  }

  getBrandById(id: string): Observable<Brand> {
    const brandDocRef = doc(this.collectionRef, id);
    return new Observable((observer) => {
      getDoc(brandDocRef)
        .then((brandDoc: DocumentData) => {
          if (brandDoc['exists']()) {
            const brand = brandDoc['data']() as Brand;
            brand.id = brandDoc['id'];
            observer.next(brand);
          } else {
            observer.error('Brand not found');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
