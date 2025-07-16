import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { W2pState } from './w2p-store';

const w2pReducers: ActionReducerMap<W2pState> = {};

const w2pEffects = [];

@NgModule({
  imports: [EffectsModule.forFeature(w2pEffects), StoreModule.forFeature('w2p', w2pReducers)],
})
export class W2pStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<W2pState>)[]) {
    return StoreModule.forFeature('w2p', pick(w2pReducers, reducers));
  }
}
