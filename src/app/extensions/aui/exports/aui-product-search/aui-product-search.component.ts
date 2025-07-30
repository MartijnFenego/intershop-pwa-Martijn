import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'custom-aui-product-search',
  templateUrl: './aui-product-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./aui-product-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuiProductSearchComponent { }
