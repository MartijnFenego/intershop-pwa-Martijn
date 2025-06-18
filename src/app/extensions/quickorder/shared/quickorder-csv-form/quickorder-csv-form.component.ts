import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CsvImportHelper } from 'ish-core/models/csv-import/csv-import.helper';
import { CsvData } from 'ish-core/models/csv-import/csv-import.model';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { CsvImportComponent } from 'ish-shared/components/csv-import/csv-import.component';

@Component({
  selector: 'ish-quickorder-csv-form',
  templateUrl: './quickorder-csv-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CsvImportHelper],
})
export class QuickorderCsvFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  private productsFromCsv: SkuQuantityType[] = [];
  csvForm: FormGroup;

  quickOrderHeaders: string[] = ['Product ID', 'Quantity'];

  status: 'Default' | 'InvalidFormat' | 'InvalidHeader' | 'ValidFormat' = 'Default';

  csvImportComponent: CsvImportComponent;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private csvImportHelper: CsvImportHelper,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productsFromCsv = [];
    this.csvForm = this.fb.group({
      csvFile: [undefined],
    });
  }

  parseCsvData(csvData: CsvData) {
    try {
      const records = csvData.data.map(line => line.split(',')).filter(columns => columns.length >= 2);
      this.productsFromCsv = records
        .map(columns => ({
          sku: columns[0].trim(),
          quantity: +columns[1].trim(),
        }))
        .filter(record => record.sku && !isNaN(record.quantity));
    } catch (error) {
      this.status = 'InvalidFormat';
      this.productsFromCsv = [];
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.csvImportHelper
      .processCsvFileChange(input.files[0], this.quickOrderHeaders)
      .then(fileContent => {
        this.parseCsvData(fileContent as CsvData);
        this.status = 'ValidFormat';
        this.cdRef.markForCheck();
      })
      .catch(error => {
        this.status = error;
        this.cdRef.markForCheck();
      });
  }

  addCsvToCart() {
    if (this.productsFromCsv.length > 0) {
      this.productsFromCsv.forEach(product => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });
    }
    this.resetInput();
  }

  resetInput() {
    this.productsFromCsv = [];
    this.status = 'Default';
    this.csvForm.reset();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  get isCsvDisabled() {
    return this.status !== 'ValidFormat' && this.status !== 'Default';
  }

  get parsedProducts(): SkuQuantityType[] {
    return this.productsFromCsv;
  }
}
