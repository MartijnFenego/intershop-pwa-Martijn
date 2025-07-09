import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { AuiState } from './aui-store';

const auiReducers: ActionReducerMap<AuiState> = {};

const auiEffects = [];

@NgModule({
  imports: [EffectsModule.forFeature(auiEffects), StoreModule.forFeature('aui', auiReducers)],
})
export class AuiStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<AuiState>)[]) {
    return StoreModule.forFeature('aui', pick(auiReducers, reducers));
  }
}
