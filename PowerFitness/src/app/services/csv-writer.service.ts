import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CsvWriterService {
  constructor() {}

  generateCSV(products: Product[]): void {
    const csvContent = this.convertToCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'products.csv');
    link.style.visibility = 'hidden';

    link.onload = () => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    document.body.appendChild(link);
    link.click();
  }

  private convertToCSV(products: Product[]): string {
    const headers = 'id,name,description,price,brand,category,size,sizes,stock,discount,imageUrl,imageUrl2,imageUrl3,imageUrl4,flavor,flavors';
    const rows = products.map(product => {
      const {
        id,
        name,
        description,
        price,
        brand,
        category,
        size,
        sizes,
        stock,
        discount,
        imageUrl,
        flavors
      } = product;

      // Comprobar si sizes y flavors son nulos o indefinidos antes de unirlos
      const sizesString = sizes ? sizes.join(',') : '';
      const flavorsString = flavors ? flavors.join(',') : '';

      return `${id},"${name}","${description}",${price},"${brand}","${category}","${size}","${sizesString}","${stock}",${discount},"${imageUrl}","${flavorsString}"`;
    });

    return `${headers}\n${rows.join('\n')}`;
  }
}
