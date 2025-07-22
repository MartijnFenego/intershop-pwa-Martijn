import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

import { AuiFacade } from '../../facades/aui.facade';

/**
 * An Angular wrapper for `<aui-init>`
 * Also loads the AUI resources and triggers the init script for aui which reads the `<aui-init>` config.
 *
 * Usage: include `<ish-aui-init>` somewhere on the page and it will trigger AUI to set itself up based on other custom AUI elements
 */
@Component({
  selector: 'ish-aui-init',
  templateUrl: './aui-init.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuiInitComponent implements AfterViewInit {
  constructor(private auiFacade: AuiFacade) { }

  ngAfterViewInit(): void {
    this.auiFacade.initAUI();
  }

  /*
   * TODO: these getters all need to return dynamic values
   */
  get appId() {
    return 'testing0C9UAYENBP';
  }
  get apiKey() {
    return '3e7602db35eb6bb9ed9d0dd2fdd9071c';
  }
  get baseSearchUrl() {
    return 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewAUI-ProductSearch';
  }
  get fallbackUrl() {
    return 'https://www.midocean.com/benelux/nl/eur/';
  }
  get urlRewriteEnabled() {
    return true;
  }
  get pageBaseUrl() {
    return 'https://www.midocean.com/benelux/nl/eur/';
  }
  get rawMtsUrl() {
    return 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewProduct-Start?SKU=';
  }
  get rawMtoUrl() {
    return 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewContent-Start?PageletEntryPointID=';
  }
  get categoryBaseUrl() {
    return 'https://www.midocean.com/benelux/nl/eur/';
  }
  get rawCategoryUrl() {
    return 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewStandardCatalog-Browse?CatalogID=__0__&CategoryName=__1__';
  }
  get categoryUrlsDisabled() {
    return false;
  }
  get currencyCode() {
    return 'EUR';
  }
}
