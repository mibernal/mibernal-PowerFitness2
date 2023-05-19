import { TestBed } from '@angular/core/testing';

import { CsvWriterService } from './csv-writer.service';

describe('CsvWriterService', () => {
  let service: CsvWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvWriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
