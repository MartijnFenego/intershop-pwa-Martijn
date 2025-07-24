import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { W2pPrintPositionsManagerComponent } from 'src/app/extensions/w2p/exports/w2p-print-positions-manager/w2p-print-positions-manager.component';

@Component({
  selector: 'custom-tryout-page',
  templateUrl: './tryout-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TryoutPageComponent {
  constructor(private modalService: NgbModal) { }

  openW2pPrintPositionsManager() {
    const modal = this.modalService.open(W2pPrintPositionsManagerComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
    });

    const modalComponent = modal.componentInstance as W2pPrintPositionsManagerComponent;

    // Listen for close event and close modal
    modalComponent.close.pipe(first()).subscribe(() => {
      modal.dismiss();
    });
  }
}
