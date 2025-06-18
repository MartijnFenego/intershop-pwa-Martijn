import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { CsvImportHelper } from 'ish-core/models/csv-import/csv-import.helper';
import { CsvData } from 'ish-core/models/csv-import/csv-import.model';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-csv-import',
  templateUrl: './cost-center-csv-import.component.html',
  providers: [CsvImportHelper],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterCsvImportComponent implements OnInit {
  csvForm: FormGroup;
  parsedCostCenters: CostCenterBase[];

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;

  status: 'Default' | 'InvalidFormat' | 'InvalidHeader' | 'ValidFormat' = 'Default';

  costCenterHeaders: string[] = [
    'costCenterId',
    'name',
    'budgetValue',
    'budgetCurrency',
    'budgetPeriod',
    'costCenterOwnerLogin',
    'active',
  ];

  constructor(
    private organizationManagementFacade: OrganizationManagementFacade,
    private fb: FormBuilder,
    private csvImportHelper: CsvImportHelper,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.parsedCostCenters = [];
    this.csvForm = this.fb.group({
      csvFile: [undefined],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.csvImportHelper
      .processCsvFileChange(input.files[0], this.costCenterHeaders)
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

  parseCsvData(csvData: CsvData) {
    if (!csvData) {
      this.parsedCostCenters = [];
      return;
    }

    const parsedData: Partial<CostCenterBase>[] = csvData.data.map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Partial<CostCenterBase> = {};
      let budgetValue: number | undefined;
      let budgetCurrency: string | undefined;
      let costCenterOwnerLogin: string | undefined;

      csvData.headers.forEach((header, index) => {
        const value = values[index] !== undefined ? values[index] : '';

        switch (header) {
          case 'budgetValue':
            budgetValue = value.trim() !== '' ? +value : undefined;
            break;
          case 'budgetCurrency':
            budgetCurrency = value;
            break;
          case 'costCenterOwnerLogin':
            costCenterOwnerLogin = value;
            break;
          case 'active':
            obj.active = value.trim() !== '' ? value?.toLowerCase() === 'true' : undefined;
            break;
          default:
            (obj as Record<string, string>)[header] = value;
            break;
        }
      });

      obj.budget = {
        type: 'Money',
        value: budgetValue,
        currency: budgetCurrency,
      };

      obj.costCenterOwner = {
        login: costCenterOwnerLogin,
      };

      return obj;
    });
    this.parsedCostCenters = parsedData as CostCenterBase[];
  }

  resetInput() {
    this.parsedCostCenters = [];
    this.status = 'Default';
  }

  submitCostCenters() {
    if (this.parsedCostCenters.length === 0) {
      return;
    }

    this.organizationManagementFacade.addCostCenterFromCSV(this.parsedCostCenters);
  }

  get isCsvDisabled() {
    return this.status !== 'ValidFormat' && this.status !== 'Default';
  }
}
