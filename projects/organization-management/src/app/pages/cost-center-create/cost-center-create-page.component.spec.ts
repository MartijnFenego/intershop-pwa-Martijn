import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { CsvImportComponent, CsvParsedEvent } from 'ish-shared/components/csv-import/csv-import.component';

import { CostCenterFormComponent } from '../../components/cost-center-form/cost-center-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterCreatePageComponent } from './cost-center-create-page.component';

describe('Cost Center Create Page Component', () => {
  let component: CostCenterCreatePageComponent;
  let fixture: ComponentFixture<CostCenterCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  const costCenterTestData: CostCenterBase[] = [
    {
      id: undefined,
      costCenterId: '123',
      name: 'Test Center 1',
      budget: { type: 'Money', value: 1000, currency: 'USD' },
      budgetPeriod: 'yearly',
      costCenterOwner: { login: 'owner1' },
      active: true,
    },
    {
      id: undefined,
      costCenterId: '456',
      name: 'Test Center 2',
      budget: { type: 'Money', value: 2000, currency: 'EUR' },
      budgetPeriod: 'monthly',
      costCenterOwner: { login: 'owner2' },
      active: false,
    },
  ];

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    when(organizationManagementFacade.addCostCenterFromCSV(anything())).thenReturn();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CostCenterCreatePageComponent, CsvImportComponent, MockComponent(CostCenterFormComponent)],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterCreatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(FormBuilder);
    component.form = fb.group({
      costCenterId: ['100400', [Validators.required]],
      name: ['Marketing', [Validators.required]],
      active: [true],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the cost center form after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('ish-cost-center-form')).toBeTruthy();
  });

  it('should parse CSV correctly', () => {
    const csvParsedEvent: CsvParsedEvent = {
      headers: ['costCenterId', 'name', 'budgetValue', 'budgetCurrency', 'costCenterOwnerLogin', 'active'],
      data: ['123,Test Center,1000,USD,owner,true'],
    };

    component.handleCsvImport(csvParsedEvent);

    const parsedData: CostCenterBase[] = component.csvData;

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);

    const row = parsedData[0];
    expect(row.costCenterId).toEqual('123');
    expect(row.name).toEqual('Test Center');
    expect(row.budget).toEqual({ type: 'Money', value: 1000, currency: 'USD' });
    expect(row.costCenterOwner).toEqual({ login: 'owner' });
  });

  it('should handle empty CSV', () => {
    const csvParsedEvent: CsvParsedEvent = {
      headers: ['costCenterId', 'name', 'budgetValue', 'budgetCurrency', 'costCenterOwnerLogin', 'active'],
      data: [''],
    };

    component.handleCsvImport(csvParsedEvent);

    const parsedData: CostCenterBase[] = component.csvData;

    expect(parsedData).toBeTruthy();
    expect(parsedData).toHaveLength(1);
  });

  it('should call addCostCenterFromCSV on submit', () => {
    const csvData: CostCenterBase[] = [costCenterTestData[0]];

    component.csvData = csvData;

    component.submitCostCenterImports();

    verify(organizationManagementFacade.addCostCenterFromCSV(component.csvData)).once();
  });

  it('should not call addCostCenterFromCSV when csvData is empty', () => {
    component.csvData = [];
    component.submitCostCenterImports();

    verify(organizationManagementFacade.addCostCenterFromCSV(component.csvData)).never();
  });

  it('should reset the csv data', () => {
    const mockCsvImportComponent = mock(CsvImportComponent);
    component.csvImportComponent = instance(mockCsvImportComponent);

    component.csvData = costCenterTestData;
    component.resetCsvData();

    expect(component.csvData).toBeEmpty();
    verify(mockCsvImportComponent.reset()).once();
  });
});
