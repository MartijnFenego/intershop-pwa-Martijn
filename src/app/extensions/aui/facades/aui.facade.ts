import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getAuiState } from '../store/aui-store';
import { ResourceLoaderService } from 'ish-core/utils/resource-loader/resource-loader.service';
import { EMPTY, map, Observable, tap } from 'rxjs';

/**
 * This type reflects what can be called on auiCtrl but the code for it is not in this repo.
 * So it is duplicate code and not at all guaranteed to be correct or up to date.
 * Still, having a type for auiCtrl in Angular gives some level of type safety and convenience.
 */
type AUIController = {
  initConfig(): void;
  initConfigWithURL(configUrl: string): void;
};

declare const auiCtrl: AUIController;

enum AuiInitState {
  Uninitialized,
  Initializing,
  Ready,
}

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class AuiFacade {
  constructor(private store: Store, private resourceLoaderService: ResourceLoaderService) { }

  private auiInitState = AuiInitState.Uninitialized;

  /**
   * example for debugging
   */
  // TODO: use auiState$ instead of the member variables and returning an observable
  auiState$ = this.store.pipe(select(getAuiState));

  /**
   * Add the JS and CSS sources to the html, waits for them to load and then calls the init method on the `AUIController`.
   * After initialization, AUI should recognise and use the `<aui-xxx>` web components all by itself.
   *
   * AUI should not init on the SSR server (since the JS state cannot transfer to the browser) and should only init once.
   * Calling {@link initAUI} multiple times has safeties to ensure this.
   */
  initAUI(): Observable<void> {
    if (SSR || this.auiInitState !== AuiInitState.Uninitialized) {
      return EMPTY;
    }

    // Since the initialization process requires async actions, an "in progress" state is needed to prevent a second overlapping initAUI() call
    this.auiInitState = AuiInitState.Initializing;

    /*
     * Load The AUI JS bundle
     */
    const scriptObservables = this.resourceLoaderService
      // TODO: via config or something to allow dev
      // .loadScript('https://intershop-local.midocean.com:3000/algolia-ui/develop/algolia-ui-bundle.js')
      .loadScript('https://cdn2.midocean.com/algolia-ui/develop/algolia-ui-bundle.js')
      .pipe(
        tap({
          next: () => {
            // Init storefront
            auiCtrl.initConfigWithURL(
              // TODO: Url needs to come from config
              'https://intershop-acc-live.midocean.com/INTERSHOP/rest/WFS/midocean-BLX-Site/-/aui-config?localeId=en_US'
            );

            this.auiInitState = AuiInitState.Ready;
          },
          error: () => this.auiInitState = AuiInitState.Uninitialized,
        })
      );

    /*
     * Load The AUI CSS
     */
    // TODO: get from config
    const styleObservables = this.resourceLoaderService.loadStylesheet('https://cdn2.midocean.com/algolia-ui/develop/algolia-ui.css');

    return this.resourceLoaderService
      .flatJoin(styleObservables, scriptObservables)
      .pipe(map(_ => { }));
  }
}
