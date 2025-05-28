import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { CsvImportComponent, CsvParsedEvent } from 'ish-shared/components/csv-import/csv-import.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-create-page',
  templateUrl: './cost-center-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  csvData: CostCenterBase[];

  form = new UntypedFormGroup({});

  costCenterHeaders: string[] = [
    'costCenterId',
    'name',
    'budgetValue',
    'budgetCurrency',
    'budgetPeriod',
    'costCenterOwnerLogin',
    'active',
  ];

  @ViewChild(CsvImportComponent, { static: false })
  csvImportComponent: CsvImportComponent;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
    this.csvData = [];
  }

  submitForm() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const costCenter: CostCenterBase = {
        id: undefined,
        costCenterId: formValue.costCenterId,
        name: formValue.name,
        budget: { value: formValue.budgetValue, currency: formValue.currency, type: 'Money' },
        budgetPeriod: formValue.budgetPeriod,
        costCenterOwner: { login: formValue.costCenterManager },
        active: formValue.active,
      };

      this.organizationManagementFacade.addCostCenter(costCenter);
    }
  }

  handleCsvImport(event: CsvParsedEvent) {
    if (!event.data) {
      this.csvData = [];
      return;
    }

    const parsedData: Partial<CostCenterBase>[] = event.data.map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Partial<CostCenterBase> = {};
      let budgetValue: number | undefined;
      let budgetCurrency: string | undefined;
      let costCenterOwnerLogin: string | undefined;
      let active: boolean | undefined;

      event.headers.forEach((header, index) => {
        const value = values[index];

        switch (header) {
          case 'budgetValue':
            budgetValue = +value;
            break;
          case 'budgetCurrency':
            budgetCurrency = value;
            break;
          case 'costCenterOwnerLogin':
            costCenterOwnerLogin = value;
            break;
          case 'active':
            active = value?.toLowerCase() === 'true';
            break;
          default:
            (obj as Record<string, string>)[header] = value;
            break;
        }
      });

      if (budgetValue !== undefined && budgetCurrency) {
        obj.budget = {
          type: 'Money',
          value: budgetValue,
          currency: budgetCurrency,
        };
      }

      if (costCenterOwnerLogin) {
        obj.costCenterOwner = {
          login: costCenterOwnerLogin,
        };
      }

      if (active !== undefined) {
        obj.active = active;
      }

      return obj;
    });

    this.csvData = parsedData as CostCenterBase[];
  }

  submitCostCenterImports() {
    if (this.csvData.length === 0) {
      return;
    }
    this.organizationManagementFacade.addCostCenterFromCSV(this.csvData);
  }

  resetCsvData(): void {
    this.csvData = [];
    if (this.csvImportComponent) {
      this.csvImportComponent.reset();
    }
  }
}
