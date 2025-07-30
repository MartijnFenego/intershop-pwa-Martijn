import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { W2pFacade } from '../../facades/w2p.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type PrintPositionActionDetail = {
  positionId: string;
  positionName: string;
  printPositionSAPCode: string;
  technique: {
    id: string;
    techniqueName: string;
    printTechniqueSAPCode: string;
  };
};

@Component({
  selector: 'custom-w2p-print-positions-manager',
  templateUrl: './w2p-print-positions-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class W2pPrintPositionsManagerComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);

  @Output() close = new EventEmitter<void>();

  constructor(private w2pFacade: W2pFacade) { }

  ngAfterViewInit(): void {
    this.w2pFacade
      .initCommonW2P()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  // https://intershop-acc-live.midocean.com/benelux/us/eur/ar1804-85-zid10240565
  get productSku() {
    return '40000190';
  }
  get variantSku() {
    return '10240565';
  }
  get context() {
    return 'pdp';
  }
  get languageCode() {
    return 'en';
  }
  get tok() {
    return this.w2pFacade.getToken();
  }
  get sapCustomerId() {
    return this.w2pFacade.getSapCustomerId();
  }

  onPrintPositionAction(event: Event) {
    const detail = (event as CustomEvent<PrintPositionActionDetail[]>).detail;
    console.log('onPrintPositionAction', detail);
  }

  onPrintPositionCancel() {
    console.log('closing...');
    this.close.emit();
  }
}
