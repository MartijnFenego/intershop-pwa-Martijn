import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'w2p', location: () => import('../store/w2p-store.module').then(m => m.W2pStoreModule) },
      multi: true,
    },
  ],
  declarations: [],
  exports: [],
})
export class W2pExportsModule {}
