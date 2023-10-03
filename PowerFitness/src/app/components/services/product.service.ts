import { Injectable } from '@angular/core';
import { map, Observable, from } from 'rxjs';
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
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { CsvParserService } from '../../services/csv-parser.service';
import { Subject } from 'rxjs';
import { Brand } from 'src/app/models/brand.model';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: any;
  private collectionRef: CollectionReference<DocumentData>;
  private addToCartSubject: Subject<Product> = new Subject<Product>();
  addToCart$: Observable<Product> = this.addToCartSubject.asObservable();
  productService: any;
  selectedSize: any;

  constructor(private csvParserService: CsvParserService) {
    const app = initializeApp(environment.firebase);
    const firestore = getFirestore(app);
    this.collectionRef = collection(firestore, 'productos');

    const file = new File([''], 'products.csv'); // Crear objeto File vacío con el nombre del archivo
    this.csvParserService.importProductsFromCSV(file);
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

    // Asegúrate de que imageUrl sea un arreglo
    const imageUrlArray = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];

    // Crea un nuevo objeto product con las propiedades actualizadas
    const updatedProduct = { ...product, imageUrl: imageUrlArray };

    // Utiliza throwError para manejar errores y devolver un Observable con el error
    return from(
      updateDoc(productDocRef, updatedProduct)
        .then(() => {
          console.log('Actualización completa');
        })
        .catch((error) => {
          console.error('Error al actualizar el producto:', error);
          return throwError(error);
        })
    );
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

  getBrands(): Observable<Brand[]> {
    const brandsQuery = query(collection(this.collectionRef.firestore, 'brands'), orderBy('name'));
    return from(getDocs(brandsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Brand }))
      )
    );
  }

  addProductToCart(product: Product) {
    this.addToCartSubject.next(product);
  }

  getProductCategories(products: Product[]): string[] {
    return Array.from(new Set(products.map((product) => product.category)));
  }

  getProductSizes(products: Product[]): string[] {
    return Array.from(new Set(products.map((product) => product.size)));
  }

  getProductFlavors(products: Product[]): string[] {
    return Array.from(new Set(products.flatMap((product) => product.flavors)));
  }

  scrollImages(product: Product, direction: number): void {
    const imageUrls = product.imageUrl;
    const lastIndex = imageUrls.length - 1;

    const currentImageIndex = product.currentImageIndex || 0;

    let newImageIndex = currentImageIndex + direction;

    if (newImageIndex > lastIndex) {
      newImageIndex = 0;
    } else if (newImageIndex < 0) {
      newImageIndex = lastIndex;
    }

    product.currentImageIndex = newImageIndex;
  }

  checkAvailability(product: Product): Observable<boolean> {
    const selectedProduct = { ...product };
    if (selectedProduct.id !== undefined) {
      selectedProduct.id = selectedProduct.id.toString();
      return this.getProductById(selectedProduct.id).pipe(
        map((dbProduct: Product) => 
              this.productService
            .getProductById(selectedProduct.id)
            .subscribe((dbProduct: Product) => {
          // Por ejemplo, puedes verificar si la cantidad disponible es mayor que 0
          return dbProduct && dbProduct.quantity > 0;
        }))
      );
    } else {
      // Manejar el caso en que el ID del producto sea undefined
      return new Observable((observer) => {
        observer.error('ID del producto no definido');
      });
    }
  }

  filterProductsByCategory(category?: string): Observable<Product[]> {
    const productsQuery = category
      ? query(this.collectionRef, orderBy('name'))
      : query(this.collectionRef, orderBy('name'));

    return from(getDocs(productsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Product,
        }))
      )
    );
  }

  filterProductsBySize(selectedSize: string): Observable<Product[]> {
    const productsQuery = selectedSize
      ? query(this.collectionRef, orderBy('name'))
      : query(this.collectionRef, orderBy('name'));

    return from(getDocs(productsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Product,
        }))
      )
    );
  }

  filterProductsByFlavor(selectedFlavor: string): Observable<Product[]> {
    const productsQuery = selectedFlavor
      ? query(this.collectionRef, orderBy('name'))
      : query(this.collectionRef, orderBy('name'));

    return from(getDocs(productsQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Product,
        }))
      )
    );
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }
}
function throwError(error: any): any {
  throw new Error('Function not implemented.');
}

