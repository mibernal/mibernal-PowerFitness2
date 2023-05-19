import { Component } from '@angular/core';
import { CsvParserService } from '../../services/csv-parser.service';

@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss']
})
export class ProductImportComponent {
  file: File;

  constructor(private csvParserService: CsvParserService) {}

  handleFileInput(input: HTMLInputElement): void {
    const files = input.files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  importCSV(): void {
    if (this.file) {
      this.csvParserService.importProductsFromCSV(this.file);
    }
  }
}
