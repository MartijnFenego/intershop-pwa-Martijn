import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'custom-aui-navigation',
  templateUrl: './aui-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuiNavigationComponent {
  /*
   * TODO: these need to become dynamic
   */
  get desktopOnly() {
    return true;
  }
  get mobileOnly() {
    return false;
  }
}
