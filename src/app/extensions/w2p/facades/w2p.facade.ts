import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getW2pState } from '../store/w2p-store';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { forkJoin, Observable, EMPTY } from 'rxjs';

enum W2pInitState {
  Uninitialized,
  Initializing,
  Ready,
}

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class W2pFacade {
  constructor(private store: Store, private scriptLoaderService: ScriptLoaderService) { }

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
  initCommonW2P(): Observable<void | never> {
    if (SSR || this.w2pCommonInitState !== W2pInitState.Uninitialized) {
      return EMPTY;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pCommonInitState = W2pInitState.Initializing;

    // Return an observable since this init is async
    const commonW2PInit$ = new Observable<void>((subscriber) => {
      /*
       * Load The W2P common JS bundle
       */
      // TODO: make configurable
      const scriptUrls = [
        "https://unpkg.com/vue@2.7.14/dist/vue.min.js",
        "https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p.min.js"
      ];
      forkJoin([
        ...scriptUrls.map(scriptUrl => this.scriptLoaderService.load(scriptUrl))
      ]).subscribe({
        next: () => {
          this.w2pCommonInitState = W2pInitState.Ready;
          subscriber.next();
          subscriber.complete();
        },
        error: error => {
          // TODO: proper error logging
          console.error(error);
          this.w2pCommonInitState = W2pInitState.Uninitialized;
          subscriber.error();
        },
      });
    });

    return commonW2PInit$;
  }

  initProofApproval() {
    if (SSR || this.w2pProofApprovalInitState !== W2pInitState.Uninitialized) {
      return;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping call
    this.w2pProofApprovalInitState = W2pInitState.Initializing;

    const scripts$: ReturnType<typeof this.scriptLoaderService.load>[] = [];

    /*
     * Load Proof approval W2P webcomponent sources
     */
    // TODO: make configurable
    const scriptUrls = [
      'https://unpkg.com/vue@2.7.14/dist/vue.min.js',
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.umd.min.js',
      'https://unpkg.com/vue-pdf-app@2.0.0'   // vue-pdf-app package
    ];

    scripts$.push(...scriptUrls.map(scriptUrl => this.scriptLoaderService.load(scriptUrl)));

    /*
     * Load the css
     */
    // TODO: make configurable
    [
      'https://webcomponents.cdn.midocean.com/intershop-acc/2.44.0/w2p-proof-approval.css',
      'https://unpkg.com/vue-pdf-app@2.0.0/dist/icons/main.css'      // vue-pdf-app package
    ].forEach(cssUrl => {
      // Prevent adding twice to the DOM
      if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const cssLink = document.createElement('link');
        // TODO: via config or something to allow dev
        cssLink.href = cssUrl;
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        cssLink.media = 'all';
        document.head.appendChild(cssLink);
      }
    });

    /*
     * Wait for all scripts to finish loading, then use them
     */
    forkJoin(scripts$).subscribe({
      next: () => {
        this.w2pProofApprovalInitState = W2pInitState.Ready

        // TODO: do stuff
      },
      error: error => {
        // TODO: proper error logging
        console.error(error);
        this.w2pProofApprovalInitState = W2pInitState.Uninitialized;
      },
    });

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
