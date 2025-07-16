import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getW2pState } from '../store/w2p-store';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class W2pFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  w2pState$ = this.store.pipe(select(getW2pState));
}
