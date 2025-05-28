import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { CsvImportComponent, CsvParsedEvent } from 'ish-shared/components/csv-import/csv-import.component';

@Component({
  selector: 'ish-quickorder-csv-form',
  templateUrl: './quickorder-csv-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderCsvFormComponent {
  private productsFromCsv: SkuQuantityType[] = [];

  quickOrderHeaders: string[] = ['Product ID', 'Quantity'];

  @ViewChild(CsvImportComponent, { static: false })
  csvImportComponent: CsvImportComponent;

  constructor(private shoppingFacade: ShoppingFacade) {}

  handleCsvImport(event: CsvParsedEvent): void {
    try {
      const records = event.data.map(line => line.split(',')).filter(columns => columns.length >= 2);
      this.productsFromCsv = records
        .map(columns => ({
          sku: columns[0].trim(),
          quantity: +columns[1].trim(),
        }))
        .filter(record => record.sku && !isNaN(record.quantity));
      this.csvImportComponent.status = this.productsFromCsv.length > 0 ? 'ValidFormat' : 'InvalidFormat';
    } catch (error) {
      this.csvImportComponent.status = 'InvalidFormat';
      this.productsFromCsv = [];
    }
  }

  addCsvToCart() {
    if (this.csvImportComponent.status === 'ValidFormat') {
      if (this.productsFromCsv.length > 0) {
        this.productsFromCsv.forEach(product => {
          this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
        });
      }
      this.resetCsvProductArray();
    }
  }

  resetCsvProductArray() {
    this.productsFromCsv = [];
    if (this.csvImportComponent) {
      this.csvImportComponent.reset();
    }
  }

  get isCsvDisabled() {
    return !this.csvImportComponent || this.csvImportComponent.status !== 'ValidFormat';
  }

  get parsedProducts(): SkuQuantityType[] {
    return this.productsFromCsv;
  }
}
