import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

  constructor(private auiFacade: AuiFacade) {}

  ngAfterViewInit(): void {
    this.auiFacade.initAUI().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /*
   * TODO: these getters all need to return dynamic values
   */
  get appId() {
    return 'testing0C9UAYENBP';
    // return 'ZDHL6PW6U1';
  }
  get apiKey() {
    return '3e7602db35eb6bb9ed9d0dd2fdd9071c';
    // return '182668af1733337955dffd81893c87cc';
  }
  get baseSearchUrl() {
    return 'https://intershop-local.midocean.com:4200/search';
  }
  get fallbackUrl() {
    return 'https://intershop-local.midocean.com:4200/home';
  }
  get urlRewriteEnabled() {
    return true;
  }
  get pageBaseUrl() {
    return 'https://intershop-local.midocean.com:4200/';
  }
  get rawMtsUrl() {
    return 'https://intershop-local.midocean.com:4200/home?SKU=';
  }
  get rawMtoUrl() {
    return 'https://intershop-local.midocean.com:4200/home?PageletEntryPointID=';
  }
  get categoryBaseUrl() {
    return 'https://intershop-local.midocean.com:4200/category';
  }
  get rawCategoryUrl() {
    return 'https://intershop-local.midocean.com:4200/category?CatalogID=__0__&CategoryName=__1__';
  }
  get categoryUrlsDisabled() {
    return true;
  }
  get currencyCode() {
    return 'EUR';
  }
}
