import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CostCenterImportResult } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

type CostCenterColumnsType =
  | 'costCenterId'
  | 'costCenterName'
  | 'costCenterManager'
  | 'costCenterBudget'
  | 'costCenterBudgetPeriod'
  | 'status';

@Component({
  selector: 'ish-cost-center-import-page',
  templateUrl: './cost-center-import-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterImportPageComponent implements OnInit {
  importResults$: Observable<CostCenterImportResult[]>;
  loading$: Observable<boolean>;
  importedCostCenters: CostCenterImportResult[] = [];

  columnsToDisplay: CostCenterColumnsType[] = [
    'costCenterId',
    'costCenterName',
    'costCenterManager',
    'costCenterBudget',
    'status',
  ];
  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
    this.importResults$ = this.organizationManagementFacade.importedCostCenters$;
  }
}
