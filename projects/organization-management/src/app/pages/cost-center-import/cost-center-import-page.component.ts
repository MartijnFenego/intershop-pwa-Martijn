import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

type CostCenterColumnsType =
  | 'costCenterId'
  | 'costCenterName'
  | 'costCenterManager'
  | 'costCenterBudget'
  | 'costCenterBudgetPeriod'
  | 'status';

export type CostCenterImportResult = {
  costCenter: CostCenterBase;
  status: string;
};

@Component({
  selector: 'ish-cost-center-import-page',
  templateUrl: './cost-center-import-page.component.html',
  styleUrls: ['./cost-center-import-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterImportPageComponent implements OnInit {
  importResults$: Observable<CostCenterImportResult[]>;
  loading$: boolean;
  importedCostCenters: CostCenterImportResult[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  columnsToDisplay: CostCenterColumnsType[] = [
    'costCenterId',
    'costCenterName',
    'costCenterManager',
    'costCenterBudget',
    'status',
  ];
  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.loading$ = true;
    this.importResults$ = this.organizationManagementFacade.importedCostCenters$;
    this.importResults$.pipe(takeUntil(this.destroy$)).subscribe(importResults => {
      this.importedCostCenters = importResults;
      this.loading$ = false;
    });
  }
}
