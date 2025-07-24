import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { W2pFacade } from '../../facades/w2p.facade';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type PrintPositionActionDetail = {
  positionId: string;
  positionName: string;
  printPositionSAPCode: string;
  technique: {
    id: string;
    techniqueName: string;
    printTechniqueSAPCode: string;
  };
}

@Component({
  selector: 'custom-w2p-print-positions-manager',
  templateUrl: './w2p-print-positions-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class W2pPrintPositionsManagerComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();

  constructor(private w2pFacade: W2pFacade) { }

  ngAfterViewInit(): void {
    this.w2pFacade.initCommonW2P();
  }

  // https://intershop-acc-live.midocean.com/benelux/us/eur/ar1804-85-zid10240565
  get productSku() {
    return "40000190";
  }
  get variantSku() {
    return "10240565";
  }
  get context() {
    return "pdp";
  }
  get languageCode() {
    return "en";
  }
  get tok() {
    return "ZaJplBa4mbC8ayuSgN0b1k8p7EowDbnw+QQx2MvI1WPoedrhJbiL20VTtZZsyBZteI4i0Sd95HY+bi54891liw==";
  }
  get sapCustomerId() {
    return "80839536";
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
