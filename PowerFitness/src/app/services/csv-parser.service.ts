import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {
  constructor(private firestore: AngularFirestore) {}

  importProductsFromCSV(file: File): Observable<void> {
    return new Observable<void>(observer => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');

        const products: Product[] = [];
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(',');

          const product: Product = {
            id: currentLine[0],
            name: currentLine[1],
            description: currentLine[2],
            price: parseFloat(currentLine[3]),
            brand: currentLine[4],
            category: currentLine[5],
            size: currentLine[6],
            sizes: currentLine[7].split(','),
            stock: parseInt(currentLine[8]),
            discount: parseFloat(currentLine[9]),
            imageUrl: currentLine[10],
            imageUrl2: currentLine[11],
            imageUrl3: currentLine[12],
            imageUrl4: currentLine[13],
            flavor: currentLine[14],
            flavors: currentLine[15].split(','),
          };

          products.push(product);
        }

        // Aquí se guarda en la colección "productos" de Firestore
        this.firestore
          .collection('productos')
          .add(products)
          .then(() => {
            console.log('Products added to Firestore:', products);
            observer.next();
            observer.complete();
          })
          .catch((error) => {
            console.error('Error adding products to Firestore:', error);
            observer.error(error);
          });
      };

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        console.error('Error reading CSV file:', event.target?.error);
        observer.error(event.target?.error);
      };

      reader.readAsText(file);
    });
  }
}
