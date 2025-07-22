import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';
import { W2pPrintPositionsManagerComponent } from './w2p-print-positions-manager/w2p-print-positions-manager.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'w2p', location: () => import('../store/w2p-store.module').then(m => m.W2pStoreModule) },
      multi: true,
    },
  ],
  declarations: [W2pPrintPositionsManagerComponent],
  exports: [W2pPrintPositionsManagerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // CUSTOM_ELEMENTS_SCHEMA allows the use of the custom elements of aui web components wthin Angular templates
})
export class W2pExportsModule { }
