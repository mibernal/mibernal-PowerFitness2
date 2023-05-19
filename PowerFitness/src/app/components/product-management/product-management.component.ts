import { Component } from '@angular/core';
import { CsvWriterService } from '../../services/csv-writer.service';
import { ProductService } from '../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent {
  file: File;

  constructor(
    private csvWriterService: CsvWriterService,
    private productService: ProductService
  ) {}

  handleFileInput(input: HTMLInputElement): void {
    const files = input.files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  exportToCSV(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.csvWriterService.generateCSV(products);
    });
  }
}
