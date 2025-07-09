import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getAuiState } from '../store/aui-store';


/**
 * This type reflects what can be called on auiCtrl but the code for it is not in this repo.
 * So it is duplicate code and not at all guaranteed to be correct or up to date.
 * Still, having a type for auiCtrl in Angular gives some level of type safety and convenience.
 */
type AUIController = {
  initConfig: () => void;
  initConfigWithURL: (configUrl: string) => void;
};

declare const auiCtrl: AUIController;

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class AuiFacade {
  constructor(private store: Store) { }

  /**
   * example for debugging
   */
  auiState$ = this.store.pipe(select(getAuiState));

  initAUI(): void {
    /*
     * Load The AUI JS bundle
     */
    const bundleScript = document.createElement('script');
    // TODO: via config or something to allow dev
    bundleScript.src = 'https://cdn2.midocean.com/algolia-ui/develop/algolia-ui-bundle.js';
    bundleScript.defer = true;
    document.head.appendChild(bundleScript);

    /*
     * Load The AUI CSS
     */
    const cssLink = document.createElement('link');
    // TODO: via config or something to allow dev
    cssLink.href = 'https://cdn2.midocean.com/algolia-ui/develop/algolia-ui.css';
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.media = 'all';
    document.head.appendChild(cssLink);

    // Create an array of Promises for each script load. There is only one for now...
    var scriptPromises = Array.from([bundleScript]).map(script => {
      return new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${script.src}`);
      });
    });

    // Use Promise.all to wait for all Promises to resolve
    Promise.all(scriptPromises)
      .then(() => {
        /*
         * All scripts are loaded, now init.
         * Only use ONE of the init() functions below
         */

        // Typically the backoffice pages start the controller without config (sice there is no storefront context) and load the config to be edited via the aui-config-mgr web components (so a second init).
        // When they switch context (eg difference locale), they then reinitialize which is not something the storefront will do
        auiCtrl.initConfig();

        // Init storefront
        // TODO: Url needs to come from config
        auiCtrl.initConfigWithURL(
          'https://intershop-acc-live.midocean.com/INTERSHOP/rest/WFS/midocean-BLX-Site/-/aui-config?localeId=en_US'
        );
      })
      .catch(error => {
        // TODO: proper error logging
        console.error(error);
      });
  }
}
