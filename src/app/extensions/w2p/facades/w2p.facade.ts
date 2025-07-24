import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getW2pState } from '../store/w2p-store';
import { ResourceLoaderService } from 'ish-core/utils/resource-loader/resource-loader.service';

enum W2pInitState {
  Uninitialized,
  Initializing,
  Ready,
}

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class W2pFacade {
  constructor(private store: Store, private resourceLoaderService: ResourceLoaderService) { }

  private w2pCommonInitState = W2pInitState.Uninitialized;
  private w2pProofApprovalInitState = W2pInitState.Uninitialized;

  /**
   * example for debugging
   */
  // TODO: use w2pState$ instead of the member variables and returning an observable
  w2pState$ = this.store.pipe(select(getW2pState));

  /**
   * Subscribe to the observable to wait for the init.
   * It will trigger next() if init was sucessful and error() if it failed. If init was skipped (eg. already initialized), it will complete() without next()
   * @returns
   */
  initCommonW2P(): void {
    if (SSR || this.w2pCommonInitState !== W2pInitState.Uninitialized) {
      return;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pCommonInitState = W2pInitState.Initializing;

    /*
      * Load The W2P common JS bundle
      */
    // TODO: make configurable
    const scriptUrls = [
      "https://unpkg.com/vue@2.7.14/dist/vue.min.js",
      "https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p.min.js"
    ];
    this.resourceLoaderService
      .loadScripts(...scriptUrls)
      .subscribe({
        next: () => this.w2pCommonInitState = W2pInitState.Ready,
        error: () => this.w2pCommonInitState = W2pInitState.Uninitialized
      });
  }

  initProofApproval() {
    if (SSR || this.w2pProofApprovalInitState !== W2pInitState.Uninitialized) {
      return;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pProofApprovalInitState = W2pInitState.Initializing;

    /*
     * Load the css
     */
    // TODO: make configurable
    const stylesheetUrls = [
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.css',
      'https://unpkg.com/vue-pdf-app@2.0.0/dist/icons/main.css'      // vue-pdf-app package
    ];
    this.resourceLoaderService
      .loadStylesheets(...stylesheetUrls)
      .subscribe();   // No actions after the result but the observable needs to be triggered

    /*
     * Load Proof approval W2P webcomponent sources
     */
    // TODO: make configurable
    const scriptUrls = [
      'https://unpkg.com/vue@2.7.14/dist/vue.min.js',
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.umd.min.js',
      'https://unpkg.com/vue-pdf-app@2.0.0'   // vue-pdf-app package
    ];
    this.resourceLoaderService
      .loadScripts(...scriptUrls)
      .subscribe({
        next: () => {
          this.w2pProofApprovalInitState = W2pInitState.Ready

          // TODO: do stuff
        },
        error: () => this.w2pProofApprovalInitState = W2pInitState.Uninitialized
      });

    // TODO: this still needs to be loaded in the next() function above
    /*
    <div id="w2p-proof-approval-wrapper">
      <w2p-proof-approval>
        <template v-slot="{pdf, pageScale, config}">
          <vue-pdf-app :pdf="pdf" :pageScale="pageScale" :config="config"></vue-pdf-app>
        </template>
      </w2p-proof-approval>
    </div>
    <script>
      // W2P_COMPONENTS is loaded deferred so not guaranteed to be available until the load event is sent
      window.addEventListener('load', function() {
        W2P_COMPONENTS.proofApprovalVue = new Vue({
          components: {
            VuePdfApp: window["vue-pdf-app"],
            w2pProofApproval: window["w2p-proof-approval"]
          }
        });
      })
    </script>
     */
  }

}
