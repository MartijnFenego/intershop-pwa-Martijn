import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { W2pFacade } from '../../facades/w2p.facade';

/*
 * IMPORTANT: Vue is install for development to allow using it properly here. Note that this does not include Vue in the actual final PRD code since it is never imported.
 * The version needs to match the vue script that is loaded in W2pFacade.initProofApproval()
 * npm install --save-dev vue@2.7.14
 *
 * But we should not be forced to be executing Vue code in an angular app... Levi9 should fix this.
 */
// The workaround below loads the type of vue so that `new Vue` can be called in our code without Vue needing to be part of the PWA
import type { VueConstructor } from 'vue';
// The scripts loaded for this component expose certain global variables that we need to access blindly so they are declared below.
declare global {
  interface Window {
    ['vue-pdf-app']: any; // Exposed by the https://unpkg.com/vue-pdf-app@2.0.0 script loaded in W2pFacade.initProofApproval()
    ['w2p-proof-approval']: any; // Exposed by the w2p-proof-approval.umd.min.js script loaded in W2pFacade.initProofApproval()
  }
}

@Component({
  selector: 'custom-w2p-proof-approval',
  templateUrl: './w2p-proof-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class W2pProofApprovalComponent implements AfterViewInit {
  constructor(private elRef: ElementRef, private w2pFacade: W2pFacade) { }

  ngAfterViewInit(): void {
    this.w2pFacade.initProofApproval().subscribe(() => this.mountProofApproval());
  }

  /**
   * The loaded external scripts set certain variables on window and the Angular template of this component contains Vue templating with attributes set by Angular.
   * NOTE THAT VUE IS NOT PART OF THIS ANGULAR APP!!!
   * The Vue call below calls it on window, which gets it from the external scripts.
   */
  private mountProofApproval() {
    const hostElement = this.elRef.nativeElement;

    const Vue = (window as any).Vue as VueConstructor;
    new Vue({
      components: {
        VuePdfApp: window['vue-pdf-app'],
        w2pProofApproval: window['w2p-proof-approval'],
      },
    }).$mount(hostElement); // Mount the Vue code on the host element which will transform the entire html of the template
  }

  get context(): string {
    // The context depends on whether this is used on the PDP or in the wizard but since ISH only uses it in my account, it is hardcoded.
    return 'Customer';
  }
  get languageCode() {
    // TODO: get dynamically
    return 'en';
  }
  get personalizationId(): string {
    // TODO: get dynamically
    return 'BSZ9Xb4396TTE4DYIWu3l';
  }
  get userId(): string {
    // TODO: get dynamically
    return 'vanlom1@cronos.be';
  }
  get userFullName(): string {
    // TODO: get dynamically
    return 'Martijn Van Loocke';
  }
  get tok() {
    return this.w2pFacade.getToken();
  }
  get sapCustomerId() {
    return this.w2pFacade.getSapCustomerId();
  }
}
