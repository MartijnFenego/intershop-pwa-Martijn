import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  constructor(
    @Inject(PLATFORM_ID) private platformId: {},
    private auiFacade: AuiFacade,
    private hostElemRef: ElementRef) {

  }

  ngAfterViewInit(): void {
    // Only run once in the browser (after rehydration in case of SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.addCustomElement();
      this.auiFacade.initAUI();
    }
  }

  private addCustomElement(): void {
    const auiInitElem = document.createElement('aui-init');
    auiInitElem.setAttribute('data-app-id', 'testing0C9UAYENBP');
    auiInitElem.setAttribute('data-api-key', '3e7602db35eb6bb9ed9d0dd2fdd9071c');

    /* TODO: these values require the new PWA urls and need to be generated from somewhere */
    auiInitElem.setAttribute('data-base-search-url', 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewAUI-ProductSearch');
    auiInitElem.setAttribute('data-fallback-url', 'https://www.midocean.com/benelux/nl/eur/');
    auiInitElem.setAttribute('data-url-rewrite-enabled', '');
    auiInitElem.setAttribute('data-page-base-url', 'https://www.midocean.com/benelux/nl/eur/');
    auiInitElem.setAttribute('data-raw-mts-url', 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewProduct-Start?SKU=');
    auiInitElem.setAttribute('data-raw-mto-url', 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewContent-Start?PageletEntryPointID=');
    auiInitElem.setAttribute('data-category-base-url', 'https://www.midocean.com/benelux/nl/eur/');
    auiInitElem.setAttribute('data-raw-category-url', 'https://www.midocean.com/INTERSHOP/web/WFS/midocean-BLX-Site/nl_NL/-/EUR/ViewStandardCatalog-Browse?CatalogID=__0__&CategoryName=__1__');
    auiInitElem.setAttribute('data-category-urls-disabled', '');
    auiInitElem.setAttribute('data-currency-code', 'EUR');

    this.hostElemRef.nativeElement.appendChild(auiInitElem);
  }
}
