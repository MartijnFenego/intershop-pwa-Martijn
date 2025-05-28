import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CsvImportComponent, CsvParsedEvent } from 'ish-shared/components/csv-import/csv-import.component';

import { QuickorderCsvFormComponent } from './quickorder-csv-form.component';

describe('Quickorder Csv Form Component', () => {
  let component: QuickorderCsvFormComponent;
  let fixture: ComponentFixture<QuickorderCsvFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvImportComponent, QuickorderCsvFormComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderCsvFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should parse CSV correctly', () => {
    const csvImportComponentStub: Partial<CsvImportComponent> = {
      reset: jest.fn(),
    };
    let _status = 'Default';
    Object.defineProperty(csvImportComponentStub, 'status', {
      get: () => _status,
      set: (value: string) => {
        _status = value;
      },
      configurable: true,
    });
    component.csvImportComponent = csvImportComponentStub as CsvImportComponent;

    const csvParsedEvent: CsvParsedEvent = {
      headers: ['Product ID', 'Quantity'],
      data: ['12345,10', '67890,5'],
    };

    component.handleCsvImport(csvParsedEvent);
    expect(component.parsedProducts).toHaveLength(2);

    const firstProduct = component.parsedProducts[0];
    expect(firstProduct.sku).toEqual('12345');
    expect(firstProduct.quantity).toEqual(10);
    const secondProduct = component.parsedProducts[1];
    expect(secondProduct.sku).toEqual('67890');
    expect(secondProduct.quantity).toEqual(5);

    expect(csvImportComponentStub.status).toEqual('ValidFormat');
  });

  it('should reset CSV product array and call csvImportComponent.reset', () => {
    const csvParsedEvent: CsvParsedEvent = {
      headers: ['Product ID', 'Quantity'],
      data: ['12345,10', '67890,5'],
    };
    const csvImportComponentStub: Partial<CsvImportComponent> = {
      reset: jest.fn(),
    };
    let _status = 'Default';
    Object.defineProperty(csvImportComponentStub, 'status', {
      get: () => _status,
      set: (value: string) => {
        _status = value;
      },
      configurable: true,
    });
    component.csvImportComponent = csvImportComponentStub as CsvImportComponent;

    component.handleCsvImport(csvParsedEvent);
    expect(component.parsedProducts).toHaveLength(2);

    component.resetCsvProductArray();
    expect(component.parsedProducts).toHaveLength(0);
    expect((csvImportComponentStub.reset as jest.Mock).mock.calls).toHaveLength(1);
  });

  describe('when adding CSV products to cart', () => {
    let shoppingFacadeMock: ShoppingFacade;
    let csvImportComponentMock: CsvImportComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      shoppingFacadeMock = mock(ShoppingFacade);
      csvImportComponentMock = mock(CsvImportComponent);
      await TestBed.configureTestingModule({
        declarations: [CsvImportComponent, QuickorderCsvFormComponent],
        imports: [ReactiveFormsModule, TranslateModule.forRoot()],
        providers: [{ provide: ShoppingFacade, useValue: instance(shoppingFacadeMock) }],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(QuickorderCsvFormComponent);
      component = fixture.componentInstance;
      component.csvImportComponent = instance(csvImportComponentMock);
      fixture.detectChanges();
    });

    it('should add CSV products to cart when CSV is valid', () => {
      when(csvImportComponentMock.status).thenReturn('ValidFormat');

      const csvParsedEvent: CsvParsedEvent = {
        headers: ['Product ID', 'Quantity'],
        data: ['12345,10', '67890,5'],
      };
      component.handleCsvImport(csvParsedEvent);
      expect(component.parsedProducts).toHaveLength(2);

      component.addCsvToCart();

      verify(shoppingFacadeMock.addProductToBasket('12345', 10)).once();
      verify(shoppingFacadeMock.addProductToBasket('67890', 5)).once();
    });
  });
});
