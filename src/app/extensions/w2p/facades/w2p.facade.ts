import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, map, tap } from 'rxjs';

import { ResourceLoaderService } from 'ish-core/utils/resource-loader/resource-loader.service';

import { getW2pState } from '../store/w2p-store';

enum W2pInitState {
  Uninitialized,
  Initializing,
  Ready,
}

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class W2pFacade {
  constructor(private store: Store, private resourceLoaderService: ResourceLoaderService) {}

  private w2pCommonInitState = W2pInitState.Uninitialized;
  private w2pProofApprovalInitState = W2pInitState.Uninitialized;

  w2pState$ = this.store.pipe(select(getW2pState));

  /**
   * Subscribe to the observable to wait for the init.
   * It will trigger next() if init was sucessful and error() if it failed. If init was skipped (eg. already initialized), it will complete() without next()
   * @returns
   */
  initCommonW2P(): Observable<void> {
    if (SSR || this.w2pCommonInitState !== W2pInitState.Uninitialized) {
      return EMPTY;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pCommonInitState = W2pInitState.Initializing;

    /*
     * Load The W2P common JS bundle
     */
    // TODO: make configurable
    const scriptUrls = [
      'https://unpkg.com/vue@2.7.14/dist/vue.min.js',
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p.min.js',
    ];
    return this.resourceLoaderService.loadScripts(...scriptUrls).pipe(
      tap({
        next: () => (this.w2pCommonInitState = W2pInitState.Ready),
        error: () => (this.w2pCommonInitState = W2pInitState.Uninitialized),
      }),
      map(_ => {})
    );
  }

  initProofApproval(): Observable<void> {
    if (SSR || this.w2pProofApprovalInitState !== W2pInitState.Uninitialized) {
      return EMPTY;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pProofApprovalInitState = W2pInitState.Initializing;

    /*
     * Load Proof approval W2P webcomponent sources
     */
    // TODO: make configurable
    const scriptUrls = [
      'https://unpkg.com/vue@2.7.14/dist/vue.min.js',
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.umd.min.js',
      'https://unpkg.com/vue-pdf-app@2.0.0', // vue-pdf-app package
    ];
    const scriptObservables = this.resourceLoaderService.loadScripts(...scriptUrls).pipe(
      tap({
        next: () => {
          this.w2pProofApprovalInitState = W2pInitState.Ready;

          // TODO: do stuff
        },
        error: () => (this.w2pProofApprovalInitState = W2pInitState.Uninitialized),
      })
    );

    /*
     * Load the css
     */
    // TODO: make configurable
    const stylesheetUrls = [
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.css',
      'https://unpkg.com/vue-pdf-app@2.0.0/dist/icons/main.css', // vue-pdf-app package
    ];
    const styleObservables = this.resourceLoaderService.loadStylesheets(...stylesheetUrls);

    return this.resourceLoaderService.flatJoin(styleObservables, scriptObservables).pipe(map(_ => {}));
  }

  // Dev note: Use $(W2P_COMPONENTS.TOKEN_CONTAINER).data('token') on ACC page to see current values
  getToken() {
    // TODO: set dynamically
    return 'ZaJplBa4mbC8ayuSgN0b1k8p7EowDbnw+QQx2MvI1WN2cjf3LUlghb+FF7wqhM9WmQRDhjooMDL3EKChUv3XXA==';
  }
  getSapCustomerId() {
    // TODO: set dynamically
    return '80839536';
  }
}
